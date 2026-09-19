import "./globals.css";

export const metadata = {
  title: "둘의 하루 | 데이트 코스 비교",
  description: "출발지에서 첫 장소까지의 길과 주변 맛집을 함께 보는 데이트 코스 비교 목업",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return <html lang="ko"><body>{children}</body></html>;
}

