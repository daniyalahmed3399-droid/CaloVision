import "./globals.css";
import { Montserrat } from "next/font/google";
import StoreProvider from "../lib/store/StoreProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",

  weight: [
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
});

export const metadata = {
  title: "CaloVision",
  description: "Transforming lives through better nutrition.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}