---
title: TypeScript Highlights
author: iano
type: post
date: 2012-10-01T21:14:44+00:00
url: /blog/2012/10/01/typescript-highlights/
categories:
  - JavaScript
  - TypeScript

---
Microsoft recently released a new, open source language called [TypeScript][1]. It is a strict superset of Javascript, and compiles directly to Javascript. The compiler is open source, and written in TypeScript itself. My team at Microsoft has been dogfooding TypeScript for several months now, and I thought I&#8217;d share a few of my favorite parts of the language.

<!--more-->

Note: you can try out the TypeScript language easily, in your browser, with the [TypeScript Playground][2].

## Classes and modules

Per the [language specification][3]: 

> TypeScript syntax includes several proposed features of Ecmascript 6 (ES6), including classes and modules.

Modules can export classes, functions, and variables, and classes can have static and instance members. Classes members can have private or public scope, which is enforced by the compiler. As an example:

[ts]
  
export module Sayings {
      
export class Greeter {
          
private greeting: string;

constructor(greeting: string) {
              
this.greeting = greeting;
          
}

public greet(): void {
              
alert(this.greeting);
          
}
      
}
  
}
  
[/ts]

## Inheritance

Classes can `extend` a single base class to inherit and optionally override all its members. Overridden methods in the derived class must have a compatible signature to the base class implementation.

[ts]
  
class A {
      
x() { alert(&#8216;a.x&#8217;); }
      
y() { alert(&#8216;a.y&#8217;); }
  
}

class B extends A {
      
y() { alert(&#8216;b.y&#8217;); }
  
}

new A().x(); // prints &#8216;a.x&#8217;
  
new A().y(); // prints &#8216;a.y&#8217;
  
new B().x(); // prints &#8216;a.x&#8217;
  
new B().y(); // prints &#8216;b.y&#8217;
  
[/ts]

## Lambdas

Lambdas are not only shortened syntax for the `function` keyword, but also capture the `this` variable automatically if you are inside a class.

[ts]
  
class Greeter {
      
greeting: string = &#8216;hello &#8216;;

public makeGreeter(): (name: string) => string {
          
return name => this.greeting + name;
      
}
  
}
  
[/ts]

## Interfaces and Structural Typing

Interfaces are simple to use with internal and external code, and is checked using structural typing. Classes can implement interfaces to enforce checking, and interfaces can extend other interfaces.

[ts]
  
class Greeter {
      
greet() { alert(&#8216;Hello&#8217;); }
  
}
  
interface IGreeter {
      
greet();
  
}

var greeter: IGreeter = new Greeter();
  
greeter.greet();
  
[/ts]

## Type inference

TypeScript has extensive type inference. In the following example, the function greet will be typed `(number) => string`:

[ts]
  
class Greet {
      
greet(x: number) {
          
var s = &#8216; greetings&#8217;;
          
return x + s;
      
}
  
}
  
[/ts]

Static and member vars, return types, local variables, all are type inferred.

## Javascript is TypeScript

TypeScript is a superset of Javascript, so converting you codebase is instant. Once you are using the TypeScript compiler, you can begin adding type annotations to enable more robust type checking.

 [1]: http://www.typescriptlang.org
 [2]: http://typescriptlang.org/playground
 [3]: http://go.microsoft.com/fwlink/?LinkId=267238