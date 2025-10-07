# 🚀 Deployment Checklist - Ghana Tech Online

## ⚠️ CRITICAL: After Every Production Deployment

### 1. Deploy Code
```bash
git push origin main
```

### 2. Run Database Migrations
```bash
npx prisma migrate deploy
```

### 3. **MANDATORY: Seed Exam Questions**
```bash
npm run db:seed-production
```

**⚠️ IF YOU SKIP THIS STEP, EXAMS WILL NOT WORK!**

### 4. Verify Deployment
```bash
./test-exam-system.sh
```

### 5. Test in Production
- [ ] Complete a course
- [ ] Navigate to exam page
- [ ] Start the exam
- [ ] Verify questions load
- [ ] Submit exam
- [ ] Check certificate generation

### 6. Monitor Logs
Look for these success messages:
```
[EXAM-GET] Found X questions for course: ...
[EXAM-POST] Successfully returning X questions
[EXAM-SUBMIT] Score: X/1000
```

---

## 🐛 If Exams Don't Work

1. **Check database has questions:**
   ```bash
   ./test-exam-system.sh
   ```

2. **Re-seed if needed:**
   ```bash
   npm run db:seed-production
   ```

3. **Check server logs for errors:**
   - Look for `[EXAM-*]` prefixed messages
   - Check for database connection errors

4. **Verify environment variables:**
   - `DATABASE_URL` is set correctly
   - Points to production database

---

## 📚 Reference Documents

- **Fix Documentation:** `EXAM_DEPLOYMENT_FIX.md`
- **Main README:** `README.md`
- **Deployment Script:** `deploy-exam-questions.sh`
- **Test Script:** `test-exam-system.sh`

---

**Remember:** Exam questions are NOT automatically deployed with code!
You MUST run the seed script after deployment.
