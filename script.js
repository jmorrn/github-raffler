async function isValidGitHubUser(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    return response.ok;
  } catch (error) {
    console.error("Erro ao validar usuário:", username);
    return false;
  }
}

async function startRaffle() {
  const input = document.getElementById("usernamesInput").value;
  const usernames = input
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Validando usuários...</p>";

  const validUsers = [];
  const results = await Promise.all(
    usernames.map(async (username) => {
      const isValid = await isValidGitHubUser(username);
      return { username, isValid };
    })
  );

  resultsDiv.innerHTML = ""; // limpa

  results.forEach(({ username, isValid }) => {
    const userLine = document.createElement("div");
    userLine.className = `user ${isValid ? "valid" : "invalid"}`;
    userLine.textContent = `${isValid ? "✅" : "❌"} ${username}`;
    resultsDiv.appendChild(userLine);
    if (isValid) validUsers.push(username);
  });

  if (validUsers.length === 0) {
    const noValid = document.createElement("p");
    noValid.textContent = "Nenhum usuário válido para o sorteio.";
    resultsDiv.appendChild(noValid);
    return;
  }

  const winner = validUsers[Math.floor(Math.random() * validUsers.length)];
  const winnerText = document.createElement("div");
  winnerText.className = "winner";
  winnerText.textContent = `🎉 O vencedor é: ${winner}`;
  resultsDiv.appendChild(winnerText);
}
