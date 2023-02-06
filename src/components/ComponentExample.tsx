type ComponentExampleProps = {
  text: string;
};

export const ComponentExample = ({ text }: ComponentExampleProps) => {
  return (
    <div>
      <h1 className="p-4 text-lg">{text}</h1>
    </div>
  );
};
