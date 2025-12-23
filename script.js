document.addEventListener('DOMContentLoaded', () => {
    const shareBtn = document.getElementById('shareBtn');
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    const welcomeAudio = document.getElementById('welcomeAudio');

    // تشغيل الصوت الترحيبي عند الفتح
    welcomeAudio.play();

    // زر المشاركة
    shareBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied!');
    });

    // زر تشغيل/إيقاف الموسيقى
    musicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicBtn.style.background = '#2196F3';
        } else {
            bgMusic.pause();
            musicBtn.style.background = '#4CAF50';
        }
    });
});
