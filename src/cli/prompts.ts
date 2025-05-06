import prompts from 'prompts';

export const fullEnterPrompts = [
  {
    type: 'text',
    name: 'url',
    message: 'Please enter an URL:',
  },
  {
    type: 'select',
    name: 'difficulty',
    message: 'Difficulty',
    choices: [
      { title: 'Easy', value: 'Easy' },
      { title: 'Medium', value: 'Medium' },
      { title: 'Hard', value: 'Hard' },
    ],
  },
  {
    type: 'list',
    name: 'tags',
    message: 'Tags (comma-seperated)',
    seperator: ',',
  },
  {
    type: 'text',
    name: 'approach',
    message: 'Your approach:',
  },
  {
    type: 'select',
    name: 'status',
    message: 'How did you do?',
    choices: [
      { title: '✅ Pass', value: 'pass' },
      { title: '💥 Fail', value: 'fail' },
      { title: '⚠️ Attempted', value: 'Attempted' },
    ],
  },
  {
    type: 'toggle',
    name: 'starred',
    message: 'Star it?',
    inital: false,
    acitve: 'Yes',
    inactive: 'No',
  },
];
