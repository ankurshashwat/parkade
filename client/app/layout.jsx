import Nav from "@components/Nav";
import Session from "@context/session";
import { Provider } from "@context/context";
import "./globals.css";

export const metadata = {
  title: "Parkade",
  description:
    "Parkade provides a streamlined experience for individuals looking to monetize their parking spaces or find convenient parking solutions.",
};

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <Provider>
        <Session>
          <div className="main">
            <div className="gradient" />
          </div>

          <main className="app">
            <Nav />
            {children}
          </main>
        </Session>
      </Provider>
    </body>
  </html>
);

export default RootLayout;
