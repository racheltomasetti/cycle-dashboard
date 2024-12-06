'use client';
import { useChat } from 'ai/react';
import { Message } from 'ai';
import { Hand } from 'lucide-react';

const Chat = () => {
  const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat();
  const noMessages = true;
  const handlePrompt = () => {
    const msg = {
      id: crypto.randomUUID(),
    };
  };
  return (
    <main>
      <section className={noMessages ? '' : 'populated'}>
        {noMessages ? (
          <>
            <p>No messages yet</p>
            <br />
          </>
        ) : (
          <>
            {/* map messages onto text bubbles */}
            {/* <loadingbubble></loadingbubble> */}
          </>
        )}
      </section>
      <form onSubmit={handleSubmit}>
        <input
          className="question-box"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask a question..."
        />
        <input type="submit" />
      </form>
    </main>
  );
};
