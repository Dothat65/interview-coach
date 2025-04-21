import Card from "../components/Card"; // Import the Card component

export default function TestPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Card Component</h1>
      <Card
        title="Mock Interviews"
        description="Practice your interview skills with real-world questions."
        link="/mock-interviews"
      />
      <Card
        title="Interview Tips"
        description="Learn the best tips to ace your next interview."
        link="/interview-tips"
      />
      <Card
        title="Resources"
        description="Access a library of resources to prepare for interviews."
        link="/resources"
      />
    </div>
  );
}