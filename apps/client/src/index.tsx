import { render, Text, Box } from 'ink';

const App = () => {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="green">● WHITE RABBIT</Text>
      <Text dimColor>Press Ctrl+C to exit</Text>
    </Box>
  );
};

render(<App />);
