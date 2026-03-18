import Icon from './ui/Icon'

const styles = {
  footer: {
    backgroundColor: 'var(--imperial-blue)',
    color: '#ffffff',
    marginTop: 0,
  },
  topSection: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '60px 24px 40px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  logo: {
    fontSize: '28px',
    fontWeight: 800,
    color: 'var(--gold)',
    marginBottom: '12px',
  },
  description: {
    margin: 0,
    lineHeight: 1.7,
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  heading: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: 700,
    color: '#ffffff',
  },
  link: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    textDecoration: 'none',
  },
  bottomSection: {
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '24px',
    textAlign: 'center',
  },
  copyright: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  socialLinks: {
    display: 'flex',
    gap: '16px',
    marginTop: '16px',
  },
  socialIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--french-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
}

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.topSection}>
        <div style={styles.column}>
          <div style={styles.logo}>Chaldal</div>
          <p style={styles.description}>
            Your trusted online grocery delivery service. Fresh products delivered to your doorstep with care and convenience.
          </p>
          <div style={styles.socialLinks}>
            <div
              style={styles.socialIcon}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--steel-azure)'
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--french-blue)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Icon name="public" size={18} />
            </div>
            <div
              style={styles.socialIcon}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--steel-azure)'
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--french-blue)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Icon name="photo_camera" size={18} />
            </div>
            <div
              style={styles.socialIcon}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--steel-azure)'
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--french-blue)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Icon name="smart_display" size={18} />
            </div>
          </div>
        </div>

        <div style={styles.column}>
          <h3 style={styles.heading}>Quick Links</h3>
          <span
            style={styles.link}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)' }}
          >
            About Us
          </span>
          <span
            style={styles.link}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)' }}
          >
            How It Works
          </span>
          <span
            style={styles.link}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)' }}
          >
            Careers
          </span>
          <span
            style={styles.link}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)' }}
          >
            Press
          </span>
        </div>

        <div style={styles.column}>
          <h3 style={styles.heading}>Customer Service</h3>
          <span
            style={styles.link}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)' }}
          >
            Contact Us
          </span>
          <span
            style={styles.link}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)' }}
          >
            FAQ
          </span>
          <span
            style={styles.link}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)' }}
          >
            Shipping & Returns
          </span>
          <span
            style={styles.link}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)' }}
          >
            Terms & Conditions
          </span>
        </div>

        <div style={styles.column}>
          <h3 style={styles.heading}>Contact Info</h3>
          <p style={{ ...styles.description, display: 'flex', alignItems: 'center', gap: '8px' }}><Icon name="mail" size={16} /> support@chaldal.com</p>
          <p style={{ ...styles.description, display: 'flex', alignItems: 'center', gap: '8px' }}><Icon name="call" size={16} /> +880 1234-567890</p>
          <p style={{ ...styles.description, display: 'flex', alignItems: 'center', gap: '8px' }}><Icon name="location_on" size={16} /> Kafrul, Dhaka, Bangladesh</p>
          <p style={{ ...styles.description, marginTop: '8px' }}>
            Mon - Sat: 8:00 AM - 10:00 PM<br />
            Sunday: 9:00 AM - 6:00 PM
          </p>
        </div>
      </div>

      <div style={styles.bottomSection}>
        <p style={styles.copyright}>
          © 2024 Chaldal. All rights reserved. | Privacy Policy | Terms of Service
        </p>
      </div>
    </footer>
  )
}

export default Footer