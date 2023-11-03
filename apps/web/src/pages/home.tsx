

const Home = () => {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main className="shadcn">
        <h1>Welcome to my website!</h1>
        <p>Here's some content for the main section of the page.</p>
      </main>
      <footer>
        <p>&copy; 2021 My Website</p>
      </footer>
    </div>
  );
};

export default Home;
