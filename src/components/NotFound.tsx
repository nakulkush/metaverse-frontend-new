import FuzzyText from "./ui/FuzzyText";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-black text-white">
      <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true}>
        404
      </FuzzyText>
      <p className="text-xl mb-8 mt-4">Oops! Page not found.</p>
      <a href="/" className="text-blue-500 underline">
        Go back home
      </a>
    </div>
  );
}
