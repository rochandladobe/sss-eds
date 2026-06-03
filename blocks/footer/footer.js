export default async function decorate(block) {
  block.innerHTML = `
    <div class="footer__primary">
      <div class="footer__brand">
        <a href="/" class="footer__logo" aria-label="Selective Service System Home">
          <img src="/icons/sss-seal.svg" alt="Selective Service System seal" width="80" height="80">
          <span class="footer__logo-text">SELECTIVE<br>SERVICE SYSTEM</span>
        </a>
        <div class="footer__contact">
          <p>Call: <a href="tel:847-688-6888">847-688-6888</a></p>
          <p>Toll-free: <a href="tel:888-655-1825">888-655-1825</a></p>
          <p class="footer__hours">Hours of operation:<br>9:00 AM to 5:00 PM EST<br>Monday to Friday,<br>except on federal holidays.</p>
        </div>
      </div>

      <div class="footer__col">
        <h4 class="footer__col-heading">Reports</h4>
        <ul class="footer__links">
          <li><a href="/foia/">FOIA (Freedom of Information Act)</a></li>
          <li><a href="/reports/annual-reports-to-congress/">Annual Reports</a></li>
          <li><a href="/reports/">Budget and Performance</a></li>
          <li><a href="/data/">Data</a></li>
          <li><a href="/eeo/">EEO Resources</a></li>
          <li><a href="/reports/quality-of-information/">Quality of Information</a></li>
          <li><a href="/inspector-general/">Inspector General</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <h4 class="footer__col-heading">Quick Links</h4>
        <ul class="footer__links">
          <li><a href="/careers/">Careers and Internships</a></li>
          <li><a href="/accessibility/">Accessibility</a></li>
          <li><a href="/privacy/">Privacy Policy</a></li>
          <li><a href="/terms-of-use/">Terms of Use</a></li>
          <li><a href="https://www.usa.gov/">USA.gov</a></li>
          <li><a href="/selective-service-employees/">Employees</a></li>
          <li><a href="/vulnerability-disclosure-policy/">Vulnerability Disclosure</a></li>
          <li><a href="https://www.todaysmilitary.com/">Today's Military</a></li>
          <li><a href="https://osc.gov/">U.S. Office of Special Counsel</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <h4 class="footer__col-heading">Get In Touch</h4>
        <ul class="footer__links">
          <li>
            <a href="mailto:information@sss.gov" class="footer__contact-link">
              <svg class="footer__contact-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Email Us
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/company/selective-service-system/" class="footer__contact-link" target="_blank" rel="noopener noreferrer">
              <svg class="footer__contact-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
          </li>
        </ul>
        <div class="footer__register">
          <p class="footer__register-heading">Not Yet Registered?</p>
          <a href="https://www.sss.gov/register/" class="footer__register-btn">Register Now</a>
        </div>
      </div>
    </div>

    <div class="footer__secondary">
      <div class="footer__secondary-inner">
        <p class="footer__secondary-copy">&copy; ${new Date().getFullYear()} Selective Service System. An official website of the United States Government.</p>
        <ul class="footer__secondary-links">
          <li><a href="/accessibility/">Accessibility</a></li>
          <li><a href="/privacy/">Privacy Policy</a></li>
          <li><a href="/terms-of-use/">Terms of Use</a></li>
          <li><a href="/foia/">FOIA</a></li>
        </ul>
      </div>
    </div>
  `;
}
