---
title: 'XamlUris: Automatically generate URIs for Xaml files'
author: iano
type: post
date: 2012-06-15T18:37:08+00:00
url: /blog/2012/06/15/xamluris-automatically-generate-uris-for-xaml-files-in-wp-silverlight-or-wpf/
categories:
  - 'C#'
  - Silverlight
  - T4
  - Windows Phone
  - WPF
  - XAML

---
We all know the mantra &#8220;magic strings are evil&#8221;. Unfortunately when working with Windows Phone, Silverlight, or WPF, you often have to use strings when navigating between pages to specify the URI and any parameters. Parameters are such a pain to pass this way that most eschew them in favor of some static state shared between pages. This negates some of the benefits, especially on Windows Phone, that you get from having the parameters in your URIs, such as when dealing with live tiles and deep links.

<!--more-->

This is the way you typically navigate to a new page (examples are from Windows Phone Silverlight code):

<pre class="brush: csharp; title: ; notranslate" title="">NavigationService.Navigate(@"/PhoneApp1;component/Page1.xaml");
</pre>

With a simple [T4 Text Template][1], you can do the following instead:

<pre class="brush: csharp; title: ; notranslate" title="">NavigationService.Navigate(XamlUris.Page1());
</pre>

Instead of magic strings, you have strongly typed goodness that will fail to compile if the specified page no longer exists.

In addition, XamlUris makes passing parameters extremely simple, using either anonymous or strongly typed objects:

<pre class="brush: csharp; title: ; notranslate" title="">// Anonymous object
NavigationService.Navigate(XamlUris.Page1(new { Id = 42, Foo = "bar" }));

// Strongly typed object
NavigationService.Navigate(XamlUris.Page1(new Baz() { Id = 42, Foo = "bar" }));
</pre>

If using strongly typed objects, XamlUrls provides an extension method (ToObject) to easily get a strongly typed object on the other end (eg. OnNavigatedTo):

<pre class="brush: csharp; highlight: [3]; title: ; notranslate" title="">protected override void OnNavigatedTo(NavigationEventArgs e)
{
    var baz = NavigationContext.QueryString.ToObject&lt;Baz&gt;();

    // Use the object directly
    uxText.Text = string.Format("Id: {0}, Name: {1}", baz.Id, baz.Name);

    // or use for databinding
    uxPanel.DataContext = baz;

    base.OnNavigatedTo(e);
}
</pre>

Here is the code for XamlUris.tt:

<pre class="brush: csharp; collapse: true; light: false; title: ; toolbar: true; notranslate" title="">&lt;#@ template language="C#" hostSpecific="true" #&gt;
&lt;#@ assembly name="EnvDTE" #&gt;
&lt;#@ import namespace="EnvDTE" #&gt;
&lt;#@ import namespace="System.IO" #&gt;
&lt;#@ import namespace="System.Text.RegularExpressions" #&gt;
&lt;#@ import namespace="System.Globalization" #&gt;
&lt;# Init(); #&gt;
//-----------------------------------------------------------------------
// &lt;copyright file="XamlUris.cs" company="Ian Obermiller"&gt;
//     Copyright 2012 (c) Ian Obermiller. All rights reserved.
// &lt;/copyright&gt;
//-----------------------------------------------------------------------
namespace &lt;# WriteLine(defaultNamespace); #&gt;
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Windows.Navigation;

    /// &lt;summary&gt;
    /// Contains Uris for every page in the solution.
    /// &lt;/summary&gt;
    public static class XamlUris
    {&lt;# Process(); #&gt;

        /// &lt;summary&gt;
        /// Builds the URI from the given page and a parameters object.
        /// &lt;/summary&gt;
        /// &lt;param name="pageUri"&gt;The page URI.&lt;/param&gt;
        /// &lt;param name="parameters"&gt;The parameters object (optional).&lt;/param&gt;
        /// &lt;returns&gt;
        /// The pageUri with the properties from the parameters object as query string parameters..
        /// &lt;/returns&gt;
        public static Uri BuildUri(string pageUri, object parameters = null)
        {
            var queryString = string.Empty;

            if (parameters != null)
            {
                var keyValuePairs = parameters.GetType().GetProperties()
                    .Select(p =&gt; p.Name + "=" + Uri.EscapeDataString(p.GetValue(parameters, null).ToString()))
                    .ToArray();

                queryString = string.Join("&", keyValuePairs);

                if (!string.IsNullOrEmpty(queryString))
                {
                    queryString = "?" + queryString;
                }
            }

            return new Uri(pageUri + queryString, UriKind.Relative);
        }

        /// &lt;summary&gt;
        /// Converts the string dictionary to a strongly typed object.
        /// Intended for use with NavigationContext.QueryString.
        /// &lt;/summary&gt;
        /// &lt;typeparam name="T"&gt;The object type.&lt;/typeparam&gt;
        /// &lt;param name="queryStringDictionary"&gt;The query string dictionary.&lt;/param&gt;
        /// &lt;returns&gt;
        /// The requested strongly typed object.
        /// &lt;/returns&gt;
        public static T ToObject&lt;T&gt;(this IDictionary&lt;string, string&gt; queryStringDictionary) where T : new()
        {
            if (queryStringDictionary == null)
            {
                return default(T);
            }

            T t = new T();

            var type = typeof(T);

            var props = type.GetProperties().ToDictionary(p =&gt; p.Name, p =&gt; p);

            foreach (var param in queryStringDictionary)
            {
                PropertyInfo prop;
                if (props.TryGetValue(param.Key, out prop))
                {
                    prop.SetValue(t, Convert.ChangeType(param.Value, prop.PropertyType, null), null);
                }
            }

            return t;
        }
    }
}
&lt;#+

    Project project;
    string outputAssemblyName;
    string defaultNamespace;
    readonly Regex xClassRegex = new Regex(@"x:Class=""(?&lt;KeyName&gt;[^""]+/?)""", RegexOptions.Compiled);

    public void Init()
    {
        IServiceProvider hostServiceProvider = (IServiceProvider)Host;
        EnvDTE.DTE dte = (EnvDTE.DTE)hostServiceProvider.GetService(typeof(EnvDTE.DTE));
        EnvDTE.ProjectItem containingProjectItem = dte.Solution.FindProjectItem(Host.TemplateFile);
        project = containingProjectItem.ContainingProject;
        outputAssemblyName = project.Properties.Item("AssemblyName").Value.ToString();
        defaultNamespace = project.Properties.Item("DefaultNamespace").Value.ToString();
    }

    public void Process()
    {
        /* Build the namespace representations, which contain class etc. */
        foreach (ProjectItem projectItem in project.ProjectItems)
        {
            ProcessProjectItem(projectItem);
        }
    }
    
    string processingDirectory = string.Empty;
    
    public void ProcessProjectItem(
        ProjectItem projectItem)
    {
        string itemName = projectItem.Name; 
        if (itemName.EndsWith(".xaml", true, CultureInfo.InvariantCulture))
        {   
            string fileName = projectItem.get_FileNames(0);
            WriteLine(string.Format(
                @"
        /// &lt;summary&gt;
        /// Gets the Uri for the {0} page.
        /// &lt;/summary&gt;
        /// &lt;returns&gt;The Uri for navigation.&lt;/returns&gt;
        public static Uri {0}()
        {{
            return {0}(null);
        }}

        /// &lt;summary&gt;
        /// Builds a Uri for the {0} page.
        /// &lt;/summary&gt;
        /// &lt;param name=""parameters""&gt;The parameters object.&lt;/param&gt;
        /// &lt;returns&gt;The Uri for navigation.&lt;/returns&gt;
        public static Uri {0}(object parameters)
        {{
            return BuildUri(@""/{2};component/{1}"", parameters);
        }}",
                Path.GetFileNameWithoutExtension(itemName).Replace('.', '_').Replace(' ', '_'),
                Path.GetFileName(itemName),
                outputAssemblyName
            ));
        }

        if (projectItem.ProjectItems != null)
        {
            foreach (ProjectItem childItem in projectItem.ProjectItems)
            {
                ProcessProjectItem(childItem);
            }
        }
    }
#&gt;
</pre>

And here is an example of the generated XamlUris.cs (note that it is StyleCop and Code Analysis compliant with the default rules):

<pre class="brush: csharp; collapse: true; light: false; title: ; toolbar: true; notranslate" title="">//-----------------------------------------------------------------------
// &lt;copyright file="XamlUris.cs" company="Ian Obermiller"&gt;
//     Copyright 2012 (c) Ian Obermiller. All rights reserved.
// &lt;/copyright&gt;
//-----------------------------------------------------------------------
namespace PhoneApp1
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Windows.Navigation;

    /// &lt;summary&gt;
    /// Contains Uris for every page in the solution.
    /// &lt;/summary&gt;
    public static class XamlUris
    {
        /// &lt;summary&gt;
        /// Gets the Uri for the App page.
        /// &lt;/summary&gt;
        /// &lt;returns&gt;The Uri for navigation.&lt;/returns&gt;
        public static Uri App()
        {
            return App(null);
        }

        /// &lt;summary&gt;
        /// Builds a Uri for the App page.
        /// &lt;/summary&gt;
        /// &lt;param name="parameters"&gt;The parameters object.&lt;/param&gt;
        /// &lt;returns&gt;The Uri for navigation.&lt;/returns&gt;
        public static Uri App(object parameters)
        {
            return BuildUri(@"/PhoneApp1;component/App.xaml", parameters);
        }

        /// &lt;summary&gt;
        /// Gets the Uri for the MainPage page.
        /// &lt;/summary&gt;
        /// &lt;returns&gt;The Uri for navigation.&lt;/returns&gt;
        public static Uri MainPage()
        {
            return MainPage(null);
        }

        /// &lt;summary&gt;
        /// Builds a Uri for the MainPage page.
        /// &lt;/summary&gt;
        /// &lt;param name="parameters"&gt;The parameters object.&lt;/param&gt;
        /// &lt;returns&gt;The Uri for navigation.&lt;/returns&gt;
        public static Uri MainPage(object parameters)
        {
            return BuildUri(@"/PhoneApp1;component/MainPage.xaml", parameters);
        }

        /// &lt;summary&gt;
        /// Gets the Uri for the Page1 page.
        /// &lt;/summary&gt;
        /// &lt;returns&gt;The Uri for navigation.&lt;/returns&gt;
        public static Uri Page1()
        {
            return Page1(null);
        }

        /// &lt;summary&gt;
        /// Builds a Uri for the Page1 page.
        /// &lt;/summary&gt;
        /// &lt;param name="parameters"&gt;The parameters object.&lt;/param&gt;
        /// &lt;returns&gt;The Uri for navigation.&lt;/returns&gt;
        public static Uri Page1(object parameters)
        {
            return BuildUri(@"/PhoneApp1;component/Page1.xaml", parameters);
        }

        /// &lt;summary&gt;
        /// Gets the Uri for the PivotPage1 page.
        /// &lt;/summary&gt;
        /// &lt;returns&gt;The Uri for navigation.&lt;/returns&gt;
        public static Uri PivotPage1()
        {
            return PivotPage1(null);
        }

        /// &lt;summary&gt;
        /// Builds a Uri for the PivotPage1 page.
        /// &lt;/summary&gt;
        /// &lt;param name="parameters"&gt;The parameters object.&lt;/param&gt;
        /// &lt;returns&gt;The Uri for navigation.&lt;/returns&gt;
        public static Uri PivotPage1(object parameters)
        {
            return BuildUri(@"/PhoneApp1;component/PivotPage1.xaml", parameters);
        }

        /// &lt;summary&gt;
        /// Builds the URI from the given page and a parameters object.
        /// &lt;/summary&gt;
        /// &lt;param name="pageUri"&gt;The page URI.&lt;/param&gt;
        /// &lt;param name="parameters"&gt;The parameters object (optional).&lt;/param&gt;
        /// &lt;returns&gt;
        /// The pageUri with the properties from the parameters object as query string parameters..
        /// &lt;/returns&gt;
        public static Uri BuildUri(string pageUri, object parameters = null)
        {
            var queryString = string.Empty;

            if (parameters != null)
            {
                var keyValuePairs = parameters.GetType().GetProperties()
                    .Select(p =&gt; p.Name + "=" + Uri.EscapeDataString(p.GetValue(parameters, null).ToString()))
                    .ToArray();

                queryString = string.Join("&", keyValuePairs);

                if (!string.IsNullOrEmpty(queryString))
                {
                    queryString = "?" + queryString;
                }
            }

            return new Uri(pageUri + queryString, UriKind.Relative);
        }

        /// &lt;summary&gt;
        /// Converts the string dictionary to a strongly typed object.
        /// Intended for use with NavigationContext.QueryString.
        /// &lt;/summary&gt;
        /// &lt;typeparam name="T"&gt;The object type.&lt;/typeparam&gt;
        /// &lt;param name="queryStringDictionary"&gt;The query string dictionary.&lt;/param&gt;
        /// &lt;returns&gt;
        /// The requested strongly typed object.
        /// &lt;/returns&gt;
        public static T ToObject&lt;T&gt;(this IDictionary&lt;string, string&gt; queryStringDictionary) where T : new()
        {
            if (queryStringDictionary == null)
            {
                return default(T);
            }

            T t = new T();

            var type = typeof(T);

            var props = type.GetProperties().ToDictionary(p =&gt; p.Name, p =&gt; p);

            foreach (var param in queryStringDictionary)
            {
                PropertyInfo prop;
                if (props.TryGetValue(param.Key, out prop))
                {
                    prop.SetValue(t, Convert.ChangeType(param.Value, prop.PropertyType, null), null);
                }
            }

            return t;
        }
    }
}
</pre>

 [1]: http://msdn.microsoft.com/en-us/library/bb126445.aspx