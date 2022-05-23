import styled from '@emotion/styled';
import Head from 'next/head';
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {parse as uuidParse, stringify as uuidStringify} from 'uuid';
import {decode, encode} from './base64';
import {decrypt, encrypt} from './crypto';

const BASE_API = 'https://ianobermiller-secure.builtwithdark.com/';

interface Data {
  id: string;
  secretKey: string;
}

function parseURL(): Data | null {
  const [id, secretKey] = location.hash.slice(1).split('=');
  if (id && secretKey) {
    return {id, secretKey};
  }
  return null;
}

export default function App() {
  const [displayMessageData, setDisplayMessageData] = useState<Data | null>(
    () => null,
  );
  const [uploadResult, setUploadResult] = useState<Data | null>(null);

  // Use an effect because of SSR
  useEffect(() => {
    setDisplayMessageData(parseURL());
  }, []);

  let content;
  if (displayMessageData) {
    content = <DisplayMessage {...displayMessageData} />;
  } else if (uploadResult) {
    content = <CopyLink {...uploadResult} />;
  } else {
    content = <Input setUploadResult={setUploadResult} />;
  }

  return (
    <Root>
      <Head>
        <title>Secure Message</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
      </Head>
      <h1>Secure Message</h1>
      {content}
      <footer>
        Made with <a href="https://darklang.com/">Dark</a>.
      </footer>
    </Root>
  );
}

async function fetchMessage(data: Data): Promise<string> {
  const response = await fetch(BASE_API + '/download', {
    method: 'POST',
    body: JSON.stringify({id: base64ToUUID(data.id)}),
  });
  const json = await response.json();
  const decrypted = await decrypt({
    key: data.secretKey,
    cipherText: json.text,
  });
  return decrypted;
}

function DisplayMessage({id, secretKey}: Data): JSX.Element {
  const [plainText, setPlainText] = useState<string>('');
  const [notice, setNotice] = useState<string | null>('Downloading message...');
  useEffect(() => {
    fetchMessage({id, secretKey})
      .then(text => {
        setPlainText(text);
        setNotice(
          'Please save the information above, as it has been deleted and the link will no longer work.',
        );
      })
      .catch(() =>
        setNotice(
          'Invalid link or password. Either the link was already viewed or the password is incorrect. Did you remember to copy the part after the hash "#"?',
        ),
      );
  }, [id, secretKey]);

  return (
    <div>
      <TextArea readOnly value={plainText} />
      <div>{notice}</div>
      <CreateNew />
    </div>
  );
}

function CreateNew() {
  function createNew() {
    location.assign(location.pathname);
  }
  return <Button onClick={createNew}>Create a new secure message</Button>;
}

const MAX_LENGTH = 256;

function Input({setUploadResult}: {setUploadResult: (r: Data) => void}) {
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();

    if (!text) return;

    const {key, cipherText} = await encrypt(text);
    const response = await fetch(BASE_API + '/upload', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({text: cipherText, email}),
    });
    const {id} = await response.json();
    setUploadResult({secretKey: key, id: uuidToBase64(id)});
  }

  function onChangeText(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.currentTarget.value.slice(0, MAX_LENGTH));
  }

  function onChangeEmail(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value.slice(0, MAX_LENGTH));
  }

  return (
    <form onSubmit={submit}>
      <p>
        Your message will be encrypted before being uploaded to a secure server.
        Simply send the generated link to someone. When they open the link, the 
        message will be downloaded, decrypted and immediately deleted by the server.
        Unopened messages will be deleted after 7 days.
      </p>
      <TextArea
        value={text}
        onChange={onChangeText}
        placeholder="The password is hunter2."
      />
      <p>
        {text.length} / {MAX_LENGTH} characters
      </p>
      <p>
        Enter an email if you'd like to be notified when the message is read.
      </p>
      <TextInput
        type="text"
        value={email}
        onChange={onChangeEmail}
        placeholder="you@example.com"
      />
      <Button as="input" disabled={!text} type="submit" value="Generate Link" />
    </form>
  );
}

function CopyLink({secretKey, id}: Data): JSX.Element {
  const [didCopy, setDidCopy] = useState(false);
  async function onClick(e: React.MouseEvent<HTMLInputElement>) {
    e.currentTarget.select();
    await navigator.clipboard.writeText(e.currentTarget.value);
    setDidCopy(true);
  }

  const url = new URL(location.href);
  url.hash = id + '=' + secretKey;
  return (
    <div>
      <p>
        The message will be deleted the first time it is viewed, or after 7
        days.
      </p>
      <TextInput
        onClick={onClick}
        readOnly={true}
        type="text"
        value={url.toString()}
      />
      {didCopy && <p>Copied to clipboard!</p>}
      <CreateNew />
    </div>
  );
}

function uuidToBase64(uuid: string): string {
  return encode(uuidParse(uuid));
}

function base64ToUUID(b64: string): string {
  return uuidStringify(new Uint8Array(decode(b64)));
}

const Root = styled.div`
  box-sizing: border-box;
  max-width: 600px;
  margin: 20px auto;
  padding: 0 20px;
`;

const TextArea = styled.textarea`
  box-sizing: border-box;
  display: block;
  height: 300px;
  line-height: 1.2;
  padding: 8px;
  width: 100%;
  border-radius: 4px;
  font-size: 100%;
  margin: 20px 0;
`;

const Button = styled.button`
  box-sizing: border-box;
  display: block;
  padding: 8px;
  width: 100%;
  border-radius: 4px;
  font-size: 100%;
  margin: 20px 0;
  background: var(--accent-color);
  border: none;
  color: var(--background-color);
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--accent-color-hover);
  }
`;

const TextInput = styled.input`
  box-sizing: border-box;
  display: block;
  padding: 8px;
  width: 100%;
  border-radius: 4px;
  font-size: 100%;
  margin: 20px 0;
`;
