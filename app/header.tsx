export function Header() {
return (
      <header className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-white mb-2">DynamoDB Guestbook</h1>
            <p className="text-lg text-gray-400">Brought to you by AWS Lambda</p>
          </div>
        </div>
      </header>
    );
  };