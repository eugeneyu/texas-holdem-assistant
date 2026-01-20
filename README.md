# Texas Hold'em AI Assistant

A responsive, mobile-first web application designed to be your real-time strategic assistant at the poker table. This app calculates win probabilities, pot odds, and offers strategic advice based on game state inputs.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

## 🚀 Features

-   **Real-time Win Probability**: Monte Carlo simulations run instantly as cards are dealt to calculate your equity.
-   **Pot Odds Calculator**: Dynamic calculation of pot odds vs. equity to determine profitability.
-   **Strategic Advice Engine**: Get clear, data-driven recommendations ("FOLD", "CALL", "RAISE") based on Expected Value (EV).
-   **Hand Strength Analysis**: Instantly identifies your current best hand (e.g., "Top Pair", "Flush Draw").
-   **Mobile-First Design**: "Thumb-sized" controls and a "High Stakes Dark Mode" aesthetic optimized for mobile devices.
-   **Custom Card Selector**: Efficient graphical keyboard for rapid card input.

## 🛠 Tech Stack

-   **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Logic**: Custom Monte Carlo simulation engine & `pokersolver`

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/eugeneyu/texas-holdem-assistant.git
    cd texas-holdem-assistant
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🎮 How to Use

1.  **Game Setup**: Enter the number of players, your position, and the big blind amount.
2.  **Input Cards**: Tap your hole cards to select them.
3.  **Community Cards**: As the hand progresses (Flop, Turn, River), input the community cards.
4.  **Track Pot**: Update the pot size and the amount to call using the inputs.
5.  **Get Advice**: Watch the HUD for real-time equity updates and strategic recommendations.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
