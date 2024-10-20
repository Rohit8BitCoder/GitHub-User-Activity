const username = process.argv[2];

if (!username) {
  console.error("Please enter a GitHub username.");
  console.error('Usage: github-activity <username>');
  process.exit(1);
}

console.log(`Fetching activity for GitHub user: ${username}`);

async function fetchGitHubEvents(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    // Map through the events and create a display array for activity
    const displayactivity = data.map(event => {
      let display = '';
      switch (event.type) {
        case 'PushEvent':
          const commit_count = event.payload.commits.length;
          display = `Pushed ${commit_count} commit(s) to ${event.repo.name}`;
          break;

        case 'IssuesEvent':
          display = `Opened a new issue in ${event.repo.name}`;
          break;

        case 'WatchEvent':
          display = `Starred ${event.repo.name}`;
          break;

        case 'ForkEvent':
          display = `Forked ${event.repo.name}`;
          break;

        default:
          display = `Performed ${event.type} in ${event.repo.name}`;
          break;
      }
      return display;
    }); 

    // Check if there's any activity and print it
    if (displayactivity.length > 0) {
      console.log(`Recent activity for ${username}:`);
      displayactivity.forEach(activity => console.log(`- ${activity}`));
    } else {
      console.log(`No recent activity found for ${username}`);
    }

  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Call the function to fetch and display the events
fetchGitHubEvents(username);
