interface LogEntry {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: '✅ Pass' | '❌ Fail';
}

async function main() {
  const { default: prompts } = await import('prompts');

  const response: LogEntry = await prompts([
    {
      type: 'text',
      name: 'title',
      message: 'Problem title:',
    },
    {
      type: 'select',
      name: 'difficulty',
      message: 'Difficulty:',
      choices: [
        { title: 'Easy', value: 'Easy' },
        { title: 'Medium', value: 'Medium' },
        { title: 'Hard', value: 'Hard' },
      ],
    },
    {
      type: 'select',
      name: 'status',
      message: 'Did you pass it?',
      choices: [
        { title: '✅ Pass', value: '✅ Pass' },
        { title: '❌ Fail', value: '❌ Fail' },
      ],
    },
  ]);

  // Output as a markdown row (simulation)
  console.log('\n📝 Markdown preview:');
  console.log(`| YYYY-MM-DD | ${response.title} | ${response.difficulty} | ${response.status} |`);
}

main();
