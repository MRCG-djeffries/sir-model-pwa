# 🦠 Serverless SIR Model PWA

![R](https://img.shields.io/badge/Made%20with-R-blue?style=for-the-badge&logo=r)
![Shiny](https://img.shields.io/badge/Framework-Shiny-blueviolet?style=for-the-badge)
![WASM](https://img.shields.io/badge/Engine-WebAssembly-orange?style=for-the-badge)
![PWA](https://img.shields.io/badge/Status-Offline%20Ready-success?style=for-the-badge)

> A high-performance epidemiological simulation running entirely in your browser using **WebAssembly**. No server required.

[**🚀 Launch App**](https://your-username.github.io/sir-model-pwa/) · [Report Bug](https://github.com/your-username/sir-model-pwa/issues) · [Request Feature](https://github.com/your-username/sir-model-pwa/issues)

---

## 📖 About The Project

This application implements a **Susceptible-Infected-Recovered (SIR) Model** with vaccination dynamics. 

Unlike traditional Shiny apps that require a Linux server running R, this project uses **Shinylive** to compile R code into **WebAssembly (WASM)**. This means the mathematics runs locally on your device's CPU, making the app faster, private, and capable of working without an internet connection.

### ✨ Key Features

*   **🚫 Serverless**: No R server or cloud instance required. Hosting is static and free (GitHub Pages).
*   **📡 Offline-First**: Built as a Progressive Web App (PWA). Installs to your home screen and works in Airplane Mode.
*   **⚡ High Performance**: Uses a custom **Pure R RK4 Solver** for robust differential equation solving in the browser.
*   **🎨 Modern UI**: Styled with `bslib` for a responsive, professional interface.

## 🛠️ Built With

*   [**R**](https://www.r-project.org/) - Core logic and statistics.
*   [**Shiny**](https://shiny.posit.co/) - Reactive web framework.
*   [**Shinylive**](https://github.com/posit-dev/r-shinylive) - R to WebAssembly compiler.
*   [**Bootstrap 5**](https://getbootstrap.com/) - UI Toolkit (via `bslib`).

---

## 🚀 Getting Started

To run this project locally on your machine, follow these steps.

### Prerequisites

*   R installed on your system.
*   Required packages:
    ```R
    install.packages(c("shiny", "bslib", "shinylive"))
    ```

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your-username/sir-model-pwa.git
    cd sir-model-pwa
    ```

2.  **Build the App (Export to WASM)**
    Run the build script in RStudio or Terminal:
    ```R
    Rscript shinylive_export.R
    ```

3.  **Serve Locally** (Important for Mac Users!)
    *Do NOT use standard `localhost` servers as they may bind to IPv6.* Use Python:
    ```sh
    python3 -m http.server --directory site 8000 --bind 127.0.0.1
    ```

4.  **Visit App**
    Open `http://127.0.0.1:8000` in your browser.

---

## 🔬 How It Works

1.  **Engine Load**: On first visit, the browser downloads a stripped-down R kernel compiled to WebAssembly (~10MB).
2.  **Service Worker**: This kernel is cached by the PWA Service Worker, so subsequent loads are instant and require no internet.
3.  **Model Execution**: When you click "Run Model", your browser executes the Pure R code in `model_utils.R` directly in memory.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<center>Made with ❤️ by [Your Name]</center>
