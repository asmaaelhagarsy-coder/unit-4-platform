document.addEventListener('DOMContentLoaded', () => {
    const shareBtn = document.getElementById('shareBtn');
    shareBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied!');
    });
    const audio = document.getElementById('welcomeAudio');
    audio.play();
});
