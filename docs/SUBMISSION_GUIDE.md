# Chrome Web Store Submission Guide for Surge

## Step 1: Package Your Extension

```bash
# Make sure you're in the surge directory
cd /home/bongo/workspace/surge

# Package the extension for submission
task package
```

This creates `surge-extension.zip` in your project root.

## Step 2: Access Chrome Web Store Developer Console

1. Go to [Chrome Web Store Developer Console](https://chrome.google.com/webstore/devconsole/)
2. Sign in with your Google account (the one you paid the $5 fee with)
3. You should see the developer dashboard

## Step 3: Create New Item

1. Click **"Add new item"** button
2. Click **"Choose file"** and select your `surge-extension.zip`
3. Click **"Upload"**
4. Wait for the upload to complete

## Step 4: Fill Out Store Listing

### Basic Information
- **Name:** Surge
- **Summary:** Simple recurring alerts with custom messages. Perfect for breaks, reminders, or any timed notifications you need.
- **Category:** Productivity
- **Language:** English

### Detailed Description
Copy the detailed description from `STORE_LISTING.md`

### Graphics (Required)
You need to create these images:

**Screenshots (Required - at least 1, max 5):**
- Size: 1280x800 or 640x400 pixels
- Take screenshots of your extension popup
- Show the dark theme and countdown timer

**Small promotional tile (Required):**
- Size: 440x280 pixels  
- Create a simple tile with "Surge" text and your icon

**Large promotional tile (Optional but recommended):**
- Size: 920x680 pixels
- More detailed promotional image

**Marquee promotional tile (Optional):**
- Size: 1400x560 pixels
- For featured placement (if selected by Google)

### Privacy
- **Single purpose:** Check this box
- **Permissions:** Will be auto-detected from manifest
- **Remote code:** No (leave unchecked)
- **Host permissions:** None needed for Surge

### Privacy Policy
Use the privacy policy from `STORE_LISTING.md` or link to one hosted on your website.

## Step 5: Review Permissions

Chrome will show the permissions your extension requests:
- ✅ Storage (for saving settings)
- ✅ Alarms (for recurring notifications)
- ✅ Notifications (for desktop alerts)

These are all legitimate and expected.

## Step 6: Submit for Review

1. Click **"Submit for review"**
2. Review the summary page
3. Confirm submission

## Step 7: Wait for Approval

- **Timeline:** Usually 1-7 days
- **Email notifications:** You'll get updates on review status
- **Possible outcomes:**
  - ✅ **Approved:** Extension goes live immediately
  - ❌ **Rejected:** You'll get feedback on what to fix

## Step 8: After Approval

Once approved:
- Extension will be live on Chrome Web Store
- Users can install with one click
- You can update by uploading new versions
- Track installs and ratings in developer console

## Common Issues to Avoid

1. **Icon Issues:** Make sure your icons are exactly 16x16, 48x48, and 128x128
2. **Permissions:** Only request permissions you actually use
3. **Description:** Be honest about what the extension does
4. **Privacy:** Clearly state if you collect any data (Surge doesn't)

## Screenshots Tips

To take good screenshots:
1. Set your extension popup to active state (countdown running)
2. Use browser dev tools to capture clean screenshots
3. Show the golden theme highlights
4. Include the Surge logo in header

## Need Help?

If you run into issues:
1. Check the Chrome Web Store developer documentation
2. Review any rejection feedback carefully  
3. Make sure all required fields are filled out
4. Test your packaged extension locally first

Good luck! 🚀