window.addEventListener('load', () => {
    const activeButton = document.getElementById(
        window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1)
    );
    activeButton.classList.add("active");
});
const leaderboard_btn = document.getElementById('leaderboardButton');
leaderboard_btn.classList.add('active', 'disabledbtn');