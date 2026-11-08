# Deployment and VR hardware checklist

## A. Publish the project

1. Repository: [Squash882/interalliance-gateway-vr](https://github.com/Squash882/interalliance-gateway-vr).
2. In **Settings → Pages**, select **GitHub Actions** as the source. The included `deploy-pages.yml` workflow builds a static `_site` containing the four files required for the game.
3. On the **Actions** tab, confirm **Deploy Gateway to GitHub Pages** succeeded. The Pages settings show the public HTTPS link after successful deployment.
4. Test the link in a laptop browser. Add `?desktop=1` if you want the 2D interface rather than the 3D world.

## B. Test VR before meeting day

Use the **actual headset and controller** planned for the meeting.

- Open the HTTPS URL in the headset browser. Check that the immersive-mode control is visible and works.
- Select each floating exhibit kiosk with the controller trigger.
- In the history exhibit, activate the **2007 → 2008 → 2010** time capsules. Verify that selecting a later capsule early does not advance the timeline.
- Jump to ILC HQ and route tickets **Systems → Data → Finance** using the three holographic podiums.
- Verify the main board text is legible from a standing or seated neutral pose.
- Confirm buttons can be selected without accidental gaze triggers, and that narration works if you intend to use it.
- Complete the final path and verify the completion state. Restart before the meeting.

## C. Resilient live demonstration

- Keep a laptop and a working desktop URL ready. Browsers require internet to load A-Frame from its CDN for 3D mode; the desktop learning experience does not require it.
- Try a private browser window or reset game progress before presenting.
- If the 3D renderer is unavailable, play the stylized desktop mode. You still have the timeline, operations puzzle, scoring and official source links.
- Do not imply this is official INTERalliance software or use unapproved logos. Have a team member review facts before public recruitment use.

## D. Known limitations

- Hardware/WebXR compatibility, text legibility and controller feel **remain unverified** without actual physical-device tests.
- Program eligibility and opportunities can change; the orientation links to the official website instead of claiming live open applications.
- Browser progress is local to that device/profile, not shared or cloud synced.
