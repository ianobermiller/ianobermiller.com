import Head from 'next/head';
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {parse as uuidParse, stringify as uuidStringify} from 'uuid';
import {decode, encode} from './base64';
import {decrypt, encrypt} from './crypto';
import styles from './secure.module.scss';

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
    <div className={styles.SecureApp}>
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
    </div>
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
      <textarea readOnly value={plainText} />
      <div>{notice}</div>
      <CreateNew />
    </div>
  );
}

function CreateNew() {
  function createNew() {
    location.assign(location.pathname);
  }
  return <button onClick={createNew}>Create a new secure message</button>;
}

const MAX_LENGTH = 256;

function Input({setUploadResult}: {setUploadResult: (r: Data) => void}) {
  const [value, setValue] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();

    if (!value) return;

    const {key, cipherText} = await encrypt(value);
    const response = await fetch(BASE_API + '/upload', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({text: cipherText}),
    });
    const {id} = await response.json();
    setUploadResult({secretKey: key, id: uuidToBase64(id)});
  }

  function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.currentTarget.value.slice(0, MAX_LENGTH));
  }

  return (
    <form onSubmit={submit}>
      <p>
        Your message will be encrypted before being uploaded to a secure server.
        Simply send the generated link to someone and make sure to include the
        part after the hash "#". When they open the link, the message will be
        downloaded, decrypted and immediately deleted by the server. Unopened
        messages will be deleted after 7 days.
      </p>
      <textarea value={value} onChange={onChange} />
      <p>
        {value.length} / {MAX_LENGTH} characters
      </p>
      <input disabled={!value} type="submit" value="Generate Link" />
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
      <input
        type="text"
        readOnly={true}
        onClick={onClick}
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
