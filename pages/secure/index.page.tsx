import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {decrypt, encrypt} from './crypto';
import styles from './secure.module.scss';

const BASE_PATH = '/secure';
const BASE_API = 'https://ianobermiller-secure.builtwithdark.com/';

interface Data {
  id: string;
  secretKey: string;
}

function parseURL(): Data | null {
  const split = location.pathname.slice(BASE_PATH.length).split('/');
  const id = split[split.length - 1];
  const secretKey = location.hash.slice(1);
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
      <h1>Secure Message</h1>
      {content}
    </div>
  );
}

async function fetchMessage(data: Data): Promise<string> {
  const response = await fetch(BASE_API + '/download', {
    method: 'POST',
    body: JSON.stringify({id: data.id}),
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
    location.assign(BASE_PATH);
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
    setUploadResult({secretKey: key, id});
  }

  function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.currentTarget.value.slice(0, MAX_LENGTH));
  }

  return (
    <form onSubmit={submit}>
      {value.length} / {MAX_LENGTH} characters
      <textarea value={value} onChange={onChange} />
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
  url.hash = secretKey;
  url.pathname = BASE_PATH + '/' + id;
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
