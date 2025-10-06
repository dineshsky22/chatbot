import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/chatService';
import botAvatar from '../assets/Paint-Logo-PNG-Pic.png'; // Use paint-related logo as bot avatar
import userAvatar from '../assets/user logo.png'; // Use uploaded user logo as user avatar

function Chat() {
  // State for chat messages
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Welcome! What can I help you with today?' }
  ]);
  // State for current step in the flow
  const [step, setStep] = useState('welcome');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');

  // Option sets for each step
  const options = {
    welcome: [
      { label: 'View Product Categories', next: 'categories' },
      { label: 'Get Color Suggestions', next: 'color_suggestions' },
      { label: 'Check Order Status', next: 'order_support' },
      { label: 'Talk to Our Expert', next: 'expert' },
    ],
    categories: [
      { label: 'Interior Paints', next: 'done' },
      { label: 'Exterior Paints', next: 'done' },
      { label: 'Primers', next: 'done' },
      { label: 'Waterproofing Solutions', next: 'done' },
      { label: 'Tools & Brushes', next: 'done' },
    ],
    color_suggestions: [
      { label: 'Room-Based Suggestions', next: 'room_based' },
      { label: 'Mood/Style-Based Ideas', next: 'mood_based' },
      { label: 'Smart Suggestions', next: 'smart_suggestions' },
    ],
    room_based: [
      { label: 'Living Room', next: 'done' },
      { label: 'Bedroom', next: 'done' },       
      { label: 'Kitchen', next: 'done' },
      { label: 'Kids Room', next: 'done' },
      { label: 'Bathroom', next: 'done' },
    ],
    mood_based: [
      { label: 'Calm & Peaceful', next: 'done' },
      { label: 'Bold & Energetic', next: 'done' },
      { label: 'Warm & Cozy', next: 'done' },
      { label: 'Fresh & Bright', next: 'done' },
    ],
    smart_suggestions: [
      { label: 'Suggest Best Selling Colors', next: 'done' },
      { label: 'Trending Shades in 2025', next: 'done' },
      { label: 'See What Others Chose', next: 'done' },
    ],
    order_support: [
      { label: 'Track My Order', next: 'done' },
      { label: 'Cancel / Return Product', next: 'done' },
      { label: 'Delivery Time & Charges', next: 'done' },
      { label: 'Nearest Dealer Location', next: 'done' },
    ],
    expert: [], // Placeholder for expert chat
    done: [],
  };

  // Bot prompts for each step
  const prompts = {
    welcome: '👋 Welcome! What can I help you with today?',
    categories: 'Choose a category:',
    color_suggestions: 'How would you like your color suggestions?',
    room_based: 'Which room are you painting?',
    mood_based: 'What kind of mood do you want?',  
    smart_suggestions: 'Do you want AI-based suggestions?',
    order_support: 'Choose an option:',
    expert: 'Connecting you to our expert... (feature coming soon)',
    done: 'Thank you! If you need more help, restart the chat.',
  };

  // Option icons for main menu
  const optionIcons = {
    'View Product Categories': '🛒',
    'Get Color Suggestions': '🎨',
    'Check Order Status': '📦',
    'Talk to Our Expert': '💬',
    'Room-Based Suggestions': '🏠',
    'Mood/Style-Based Ideas': '🌈',
    'Smart Suggestions': '🤖',
    'Track My Order': '🚚',
    'Cancel / Return Product': '↩️',
    'Delivery Time & Charges': '⏰',
    'Nearest Dealer Location': '📍',
    'Interior Paints': '🎨',
    'Exterior Paints': '🏡',
    'Primers': '🧴',
    'Waterproofing Solutions': '💧',
    'Tools & Brushes': '🛠️',
    'Living Room': '🛋️',
    'Bedroom': '🛏️',
    'Kitchen': '🍳',
    'Kids Room': '🧸',
    'Bathroom': '🛁',
    'Calm & Peaceful': '🕊️',
    'Bold & Energetic': '⚡',
    'Warm & Cozy': '🔥',
    'Fresh & Bright': '🌞',
    'Suggest Best Selling Colors': '🏆',
    'Trending Shades in 2025': '📈',
    'See What Others Chose': '👀',
  };

  // Handle option click
  const handleOptionClick = async (option) => {
    setMessages((prev) => [...prev, { sender: 'user', text: option.label }]);
    setIsLoading(true);
    try {
      const botText = await sendMessage(option.label);
      setMessages((prev) => [...prev, { sender: 'bot', text: botText }]);
    } catch (e) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
    setIsLoading(false);
    setStep(option.next);
    if (prompts[option.next]) {
      setMessages((prev) => [...prev, { sender: 'bot', text: prompts[option.next] }]);
    }
  };

  // Handle text input send
  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setIsLoading(true);
    try {
      const botText = await sendMessage(input);
      setMessages((prev) => [...prev, { sender: 'bot', text: botText }]);
    } catch (e) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      {/* Minimized Floating Button (fixed, bottom right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #b6e0fe 0%, #c3f0e8 100%)',
            color: '#fff',
            boxShadow: '0 12px 32px 0 rgba(31,38,135,0.18)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 0,
            outline: 'none',
            transition: 'transform 0.22s cubic-bezier(.4,2,.6,1)',
            backdropFilter: 'blur(6px)',
            boxSizing: 'border-box',
          }}
          tabIndex={0}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img src={botAvatar} alt="Bot" style={{ width: 40, height: 40, borderRadius: '50%', boxShadow: '0 2px 8px #2563eb33' }} />
        </button>
      )}

      {/* Chatbox Widget (fixed, bottom right) */}
      {isOpen && (
        <div className="chatbox" style={{
          position: 'fixed',
          bottom: 0,
          right: 18,
          width: 360,
          maxWidth: '96vw',
          height: 580,
          maxHeight: '88vh',
          zIndex: 9999,
          borderRadius: 18,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.14)',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.95)',
          display: 'flex',
          flexDirection: 'column',
          border: 'none',
          backdropFilter: 'blur(18px)',
          animation: 'chatboxIn 0.45s cubic-bezier(.4,2,.6,1)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          {/* Header */}
          <div style={{
            height: 52,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            position: 'relative',
            boxShadow: '0 2px 12px rgba(31,38,135,0.10)',
            gap: 12,
          }}>
            <img src={botAvatar} alt="Bot" style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 8px #2563eb33', border: '2px solid #fff' }} />
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 18, letterSpacing: 0.2, textShadow: '0 1px 6px #2563eb44' }}>Nippon Paint Bot</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                marginLeft: 'auto',
                color: '#fff',
                background: 'none',
                border: 'none',
                fontSize: 24,
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.18s',
              }}
              title="Close"
            >
              ×
            </button>
            {/* Subtle divider below header */}
            <div style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              height: 1,
              background: 'rgba(255,255,255,0.18)',
              boxShadow: '0 1px 2px rgba(31,38,135,0.08)',
            }} />
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 12px 0 12px',
            background: 'rgba(255,255,255,0.95)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minHeight: 100,
            transition: 'background 0.3s',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                marginBottom: 2,
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}>
                {msg.sender === 'bot' && (
                  <img src={botAvatar} alt="Bot" style={{ width: 28, height: 28, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 8px #2563eb22', border: '2px solid #e0f2fe', marginTop: 2 }} />
                )}
                <div
                  style={{
                    background: msg.sender === 'user'
                      ? 'linear-gradient(90deg, #e3f0ff 0%, #fbeaff 100%)'
                      : 'linear-gradient(90deg, #fff 0%, #eaf6fb 100%)',
                    color: msg.sender === 'user' ? '#2563eb' : '#3b3b3b',
                    borderRadius: 16,
                    borderBottomRightRadius: msg.sender === 'user' ? 6 : 16,
                    borderBottomLeftRadius: msg.sender === 'user' ? 16 : 6,
                    padding: '10px 16px',
                    maxWidth: '80%',
                    minWidth: 32,
                    width: 'fit-content',
                    display: 'block',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-line',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    border: msg.sender === 'bot' ? '1.5px solid #b6e0fe' : 'none',
                    boxShadow: '0 2px 8px 0 rgba(31,38,135,0.04)',
                    fontSize: 15,
                    fontWeight: 500,
                    transition: 'background 0.3s',
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <img src={userAvatar} alt="User" style={{ width: 28, height: 28, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 8px #2563eb22', objectFit: 'cover', border: '2px solid #e0f2fe', marginTop: 2 }} />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Option Buttons Area (replaces input) */}
          <div
            style={{
              minHeight: 80,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderTop: 'none',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              alignItems: 'stretch',
              padding: '16px 12px 20px 12px',
              position: 'relative',
              boxShadow: '0 -4px 24px 0 rgba(31,38,135,0.06)',
              justifyContent: 'flex-start',
              transition: 'background 0.3s, max-height 0.45s cubic-bezier(.4,2,.6,1), padding 0.3s cubic-bezier(.4,2,.6,1)',
              fontFamily: 'Inter, system-ui, sans-serif',
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
              maxHeight: 400,
              overflow: 'hidden',
            }}
          >
            {isLoading && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#2563eb', fontWeight: 500, fontSize: 14, padding: '8px 0' }}>
                <span className="loader" style={{ display: 'inline-block', width: 18, height: 18, border: '3px solid #b6e0fe', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginRight: 8, verticalAlign: 'middle' }}></span>
                Getting the answer...
              </div>
            )}
            {/* Divider above options area */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 4,
              background: 'linear-gradient(180deg, rgba(182,224,254,0.18) 0%, rgba(255,255,255,0) 100%)',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              zIndex: 1,
            }} />
            {/* Text input always visible above options */}
            <div style={{ gridColumn: '1 / -1', width: '100%', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  borderRadius: 9999,
                  border: '2px solid #e2e8f0',
                  padding: '10px 10px',
                  fontSize: 15,
                  outline: 'none',
                  color: '#374151',
                  background: '#ffffff',
                  boxShadow: '0 1px 4px 0 rgba(31,38,135,0.06)',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                }}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                style={{
                  background: '#fff',
                  color: '#764ba2',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px 0 rgba(31,38,135,0.10)',
                  cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                  padding: 0,
                  outline: 'none',
                  fontSize: 20,
                  opacity: isLoading || !input.trim() ? 0.6 : 1,
                  transition: 'background 0.18s, opacity 0.18s',
                  marginLeft: 4,
                }}
                title="Send"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 11L19 3L11 19L10 13L3 11Z" fill="#764ba2"/>
                </svg>
              </button>
            </div>
            
          </div>
        </div>
      )}
      <style>{`
        /* Gradient border removed as requested */
        @keyframes bubbleInUser {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bubbleInBot {
          from { opacity: 0; transform: translateY(-24px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatboxIn {
          from { opacity: 0; transform: scale(0.85) translateY(40px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes optionFadeIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 600px) {
          .chatbox {
            width: 98vw !important;
            height: 98vh !important;
            max-width: 98vw !important;
            max-height: 98vh !important;     
            left: 0 !important;
            right: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            border-radius: 0 !important;
            padding: 0 !important;
          }
          .gradient-border:before {
            border-radius: 0 !important;
          }
          .chatbox > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

export default Chat;
