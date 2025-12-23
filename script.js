function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
}

function openSubTab(subId) {
    document.querySelectorAll('.sub-content').forEach(sub => sub.style.display = 'none');
    document.getElementById(subId).style.display = 'block';
}

// افتراضيًا افتح Lesson 1 عند تحميل الصفحة
window.onload = () => {
    openTab('lesson1');
    openSubTab('vocab1');
};
