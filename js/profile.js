// js/profile.js

document.addEventListener('DOMContentLoaded', function() {
    // 1. أهم خطوة: التحقق من تسجيل الدخول
    const currentUserJson = localStorage.getItem('currentUser');
    
    // لو مفيش داتا لليوزر الحالي، اطرده لصفحة اللوجين
    if (!currentUserJson) {
        window.location.href = 'login.html'; // تأكد من المسار
        return; // وقف تنفيذ باقي الكود
    }

    const currentUser = JSON.parse(currentUserJson);

    // 2. مسك عناصر الـ HTML
    const profileNameElement = document.getElementById('profileFullName');
    const profileEmailElement = document.getElementById('profileEmail');
    const profileLogoutBtn = document.getElementById('profileLogoutBtn');

    // 3. عرض البيانات في الصفحة
    if (profileNameElement && profileEmailElement) {
        // دمج الاسم الأول والأخير
        // بنستخدم Optional chaining (?.) عشان لو في بيانات ناقصة ميعملش ايرور
        const fullName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`;
        
        profileNameElement.textContent = fullName.trim() || 'User Name';
        profileEmailElement.textContent = currentUser.email || 'email@example.com';
    }

    // 4. تشغيل زرار الخروج اللي في صفحة البروفايل
    if (profileLogoutBtn) {
        profileLogoutBtn.addEventListener('click', function() {
            // مسح بيانات الجلسة
            localStorage.removeItem('currentUser');
            // توجيه لصفحة اللوجين أو الرئيسية
            window.location.href = 'login.html'; 
        });
    }
});