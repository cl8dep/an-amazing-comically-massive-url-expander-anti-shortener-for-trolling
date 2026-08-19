# An Amazing Comically Massive URL Expander (Anti-Shortener) for Trolling

Have you ever looked at a tiny `bit.ly` link and thought: *"This is way too short, convenient, and readable. I want something much worse"*? 

Look no further.

This project is an **Anti-Shortener**. It takes your normal URLs and converts them into an immense, 3950-character monstrosity that looks exactly like a mashed-together cryptocurrency wallet seed phrase. It's perfectly engineered to fill up an entire message screen on Telegram or WhatsApp while remaining **100% clickable**.

## 😈 Features

- **Comically Massive Links**: Generates URLs using combined `bip39` seed phrases.
- **Maximized for Trolling**: Carefully calibrated to exactly 3950 characters, leaving just enough room for your domain (`https://your-domain.com/...`) to keep the total URL length right under Telegram's strict 4096-character message limit.
- **Unbroken Text**: The generated seed words are combined without any spaces or underscores (`split(' ').join('')`), forcing messaging apps to treat it as one continuous, giant clickable link.
- **Self-Destructing**: The massive URLs expire after exactly 30 days. An automatic background job cleans up the SQLite database daily to keep your server light.
- **Lightning Fast**: Powered by `express` and `better-sqlite3` (with WAL mode) for blazing fast reads and writes.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- `pnpm` (or `npm`/`yarn`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cl8dep/an-amazing-comically-massive-url-expander-anti-shortener-for-trolling.git
   cd an-amazing-comically-massive-url-expander-anti-shortener-for-trolling
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm run dev
   ```
   *The server will start at `http://localhost:3000`.*

### Production

1. Build the TypeScript files:
   ```bash
   pnpm run build
   ```

2. Start the production server:
   ```bash
   pnpm run start
   ```

## 🛠️ How it works under the hood

When you enter a URL on the frontend, the server uses `bip39` to continuously generate 256-bit mnemonic seed phrases (24 words each) and concatenates them all together into a solid block of text. It stops right at 3950 characters.

The application acts as a standard HTTP 302 redirect. The mappings between the comically massive URL and the target URL are stored locally in a SQLite database (`data/massive_urls.db`).

## 📝 License

ISC License. Tweak it, break it, and troll your friends responsibly!