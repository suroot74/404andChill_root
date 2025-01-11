document.addEventListener("DOMContentLoaded", () => {
      const basePath = "/";
  const badges = [
      "assets/img/badges/frontpage-1996.gif",
      "assets/img/badges/get-flash-player-1996.gif",
      "assets/img/badges/internet-explorer-1996.gif",
      "assets/img/badges/internet-explorer-2000.gif",
      "assets/img/badges/macromedia-2000.gif",
      "assets/img/badges/microsoft-backoffice-1996.gif",
      "assets/img/badges/netscape-1995.gif",
      "assets/img/badges/netscape-1996.gif",
      "assets/img/badges/netscape-2000.gif",
      "assets/img/badges/quicktime-4-0-2000.gif",
      "assets/img/badges/real-player-g2-2000.gif",
      "assets/img/badges/winzip-8-0-2000.gif"
    // Add the rest of your badges here
  ];

  const randomBadge = badges[Math.floor(Math.random() * badges.length)];
  const badgeContainer = document.getElementById("random-badge");

  if (badgeContainer) {
    badgeContainer.innerHTML = `<img src="${basePath}${randomBadge}" alt="Random Badge" class="img-fluid">`;
  }
});
