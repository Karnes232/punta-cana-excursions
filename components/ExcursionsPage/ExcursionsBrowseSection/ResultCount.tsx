interface ResultCountProps {
  count: number;
  labels: {
    showing: string;
    singular: string;
    plural: string;
  };
}

export function ResultCount({ count, labels }: ResultCountProps) {
  return (
    <p className="font-body text-sm text-gray">
      {labels.showing} <span className="font-medium text-slate">{count}</span>{" "}
      {count === 1 ? labels.singular : labels.plural}
    </p>
  );
}
