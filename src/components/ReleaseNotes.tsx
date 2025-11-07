interface ReleaseNote {
  version: string;
  date: string;
  features?: string[];
  improvements?: string[];
  bugFixes?: string[];
}

const releaseNotes: ReleaseNote[] = [
  {
    version: "2.1.0",
    date: "2023-10-27",
    features: [
      "New user dashboard with customizable widgets",
      "Integration with third-party analytics platforms",
      "Dark mode option for improved accessibility",
    ],
    improvements: [
      "Enhanced performance for large datasets",
      "Improved search functionality with fuzzy matching",
      "Refined UI/UX for a more intuitive experience",
    ],
    bugFixes: [
      "Fixed an issue where filters were not resetting correctly",
      "Addressed a memory leak in the data visualization module",
    ],
  },
  {
    version: "2.0.0",
    date: "2023-09-15",
    features: [
      "Completely redesigned user interface",
      "Real-time collaborative editing features",
      "Introduction of a new plugin architecture",
    ],
    improvements: [
      "Faster data loading times",
      "More robust error handling",
      "Optimized mobile responsiveness",
    ],
    bugFixes: [
      "Resolved a critical security vulnerability",
      "Fixed incorrect data display in certain reports",
    ],
  },
  {
    version: "1.5.1",
    date: "2023-08-01",
    bugFixes: [
      "Hotfix for a login authentication issue",
      "Corrected a minor styling bug on Safari",
    ],
  },
  {
    version: "1.5.0",
    date: "2023-07-20",
    features: ["Export data to CSV and PDF formats", "Customizable email notification settings"],
    improvements: [
      "Improved accessibility for keyboard navigation",
      "Better handling of concurrent user requests",
    ],
  },
];

const ReleaseNotes = () => {
  return (
    <div>
      {releaseNotes.map((notes) => {
        return <div>{notes.date}</div>;
      })}
    </div>
  );
};

export default ReleaseNotes;
