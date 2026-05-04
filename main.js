import React from 'react';

const ASRApiTester = () => {
  const [inputText, setInputText] = React.useState('');
  const [response, setResponse] = React.useState(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>ASR API Tester</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter text to send to ASR API"
        />
        <button type="submit">Send</button>
      </form>
      {response && <div>Response: {JSON.stringify(response)}</div>}
    </div>
  );
};

export default ASRApiTester;