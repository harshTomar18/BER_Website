import AboutSection from '../models/AboutSection.model.js';
import { apiResponse } from '../utils/apiResponse.js';

/**
 * Seed default About section if none exists
 */
export const seedDefaultAbout = async () => {
  try {
    const count = await AboutSection.countDocuments();
    if (count === 0) {
      const defaultAbout = {
        overview: {
          pill: 'About BER Services',
          headline: {
            line1: 'Building Smart',
            line2: 'Software Solutions',
            accent: 'for a Better Tomorrow',
          },
          description:
            'At BER Services, we turn ideas into powerful digital experiences. From modern web & mobile applications to scalable software solutions, we help businesses grow, innovate and stay ahead in the digital world.',
          ctaPrimary: "Let's Build Together",
          ctaSecondary: 'Our Vision',
          stats: [
            { n: '50+', l: 'Projects Delivered', icon: 'code' },
            { n: '30+', l: 'Happy Clients', icon: 'clients' },
            { n: '99.9%', l: 'Uptime Reliability', icon: 'uptime' },
            { n: '100%', l: 'Client Satisfaction', icon: 'satisfaction' },
          ],
          artworkImage: '',
          artworkImageAlt: 'BER Services 3D Neo-Glass Technology Orbit',
        },
        missionVisionHeader: {
          title: 'Driven by Purpose.',
          titleAccent: 'Defined by Engineering Excellence.',
          subtitle:
            'We bridge the divide between visionary commercial ambition and resilient, production-ready software delivery.',
        },
        mission: {
          badge: 'Our Mission',
          title: 'Empowering Businesses Through Resilient Digital Engineering',
          tagline: 'Bridging the gap between cutting-edge technology and real commercial outcomes.',
          description:
            'At BER Services, our mission is to empower ambitious brands and fast-growing enterprises with resilient, high-performance, and human-centric digital solutions. We exist to eliminate the friction between complex engineering and tangible business growth—architecting websites, custom software, mobile platforms, and automated workflows that streamline day-to-day operations and reliably accelerate commercial success.',
          pillars: [
            {
              title: 'Architectural Excellence',
              desc: 'Engineering fault-tolerant, scalable, and secure digital foundations designed to withstand exponential business growth.',
            },
            {
              title: 'Measurable Commercial ROI',
              desc: 'Ensuring every single sprint, design deliverable, and marketing campaign aligns directly with client revenue and efficiency.',
            },
            {
              title: 'Human-Centered Experience',
              desc: 'Crafting intuitive, frictionless digital journeys that turn casual visitors into loyal, repeat brand advocates.',
            },
          ],
        },
        vision: {
          badge: 'Our Vision',
          title: 'Pioneering the Next Era of Intelligent Digital Transformation',
          tagline: 'Becoming the world’s most trusted partner for sustainable, future-ready technology.',
          description:
            'We envision becoming a globally respected digital technology partner, benchmarked for engineering brilliance, transparent collaboration, and transformative AI-powered business solutions. By continuously pushing the frontiers of modern cloud architectures, web standards, and intelligent automation, we strive to build sustainable digital ecosystems that help businesses thrive in an increasingly connected world.',
          milestones: [
            {
              title: 'Global Engineering Benchmarks',
              desc: 'Adopting the highest international standards of code quality, automated testing, and zero-downtime CI/CD delivery.',
            },
            {
              title: 'Practical AI & Cloud Synergy',
              desc: 'Democratizing production-grade artificial intelligence and automated workflows to give growing companies an unfair advantage.',
            },
            {
              title: 'Enduring Partnerships',
              desc: 'Cultivating long-term client relationships rooted in complete transparency, proactive advisory, and mutual growth.',
            },
          ],
        },
        valuesHeader: {
          badge: 'Our Operating Principles',
          title: 'Our Non-Negotiable',
          titleAccent: 'Core Values',
          subtitle:
            'Every system we engineer, line of code we write, and partnership we nurture is guided by four foundational tenets.',
        },
        values: [
          {
            number: '01',
            title: 'Engineering Precision & Quality',
            desc: 'We adhere to strict architectural standards, clean code principles, and comprehensive security testing. We never cut corners on performance or security.',
            icon: 'ShieldCheck',
          },
          {
            number: '02',
            title: 'Client-Centric Co-Creation',
            desc: 'We don’t treat clients as ticket numbers; we operate as invested technology advisors and an agile extension of your in-house leadership team.',
            icon: 'Users',
          },
          {
            number: '03',
            title: 'Uncompromising Transparency',
            desc: 'Clear milestones, transparent sprint tracking, honest architectural advice, and zero hidden costs or surprise delays from day one.',
            icon: 'CheckCircle2',
          },
          {
            number: '04',
            title: 'Relentless Innovation & Agility',
            desc: 'Constantly mastering next-generation web frameworks, cloud topologies, and AI automation tools to keep our clients ahead of market trends.',
            icon: 'Zap',
          },
        ],
        whyChooseUsHeader: {
          badge: 'The BER Advantage',
          title: 'Why Forward-Thinking Brands',
          titleAccent: 'Choose Us',
          subtitle:
            'We combine enterprise engineering rigor with startup velocity to deliver high-impact digital outcomes.',
        },
        whyChooseUs: [
          {
            title: 'Full-Lifecycle Engineering',
            desc: 'From technical discovery and UI/UX prototyping to cloud deployment, database architecture, and 24/7 post-launch maintenance.',
            icon: 'Layers',
          },
          {
            title: 'Agile Velocity & Live Demos',
            desc: 'Fast 2-week sprint iterations with interactive staging environments so you can see, test, and provide feedback on actual working software.',
            icon: 'Zap',
          },
          {
            title: 'Enterprise Security & NDA',
            desc: '100% strict Non-Disclosure Agreements, complete client IP ownership, and OWASP-compliant security protocols safeguarding your data.',
            icon: 'Lock',
          },
          {
            title: 'Dedicated SLA & Proactive Support',
            desc: 'Continuous server monitoring, automated backups, security patching, and rapid-response technical teams at your disposal.',
            icon: 'Headphones',
          },
        ],
        ctaBox: {
          title: 'Have an ambitious project in mind?',
          text: 'Speak directly with our senior technology team for an architectural review and free estimate.',
          buttonText: 'Get Free Consultation',
        },
        isActive: true,
      };

      await AboutSection.create(defaultAbout);
      console.log('🌱 [Seeder] Default About section initialized.');
    }
  } catch (err) {
    console.error('Error seeding default about section:', err);
  }
};

/**
 * Public: Get active About section data
 * GET /api/v1/about
 */
export const getPublicAbout = async (req, res, next) => {
  try {
    const about = await AboutSection.findOne({ isActive: true }).lean();
    return apiResponse.success(res, { about: about || null }, 'About section fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get About section data for editing
 * GET /api/v1/about/admin
 */
export const getAdminAbout = async (req, res, next) => {
  try {
    let about = await AboutSection.findOne({ isActive: true }).lean();
    if (!about) {
      about = await AboutSection.findOne().lean();
    }
    return apiResponse.success(res, { about: about || null }, 'Admin about section data fetched');
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update / Overwrite About section
 * PUT /api/v1/about/admin
 */
export const updateAdminAbout = async (req, res, next) => {
  try {
    const payload = req.body;

    const updatedAbout = await AboutSection.findOneAndUpdate(
      { isActive: true },
      { $set: payload },
      { upsert: true, new: true, runValidators: true }
    );

    return apiResponse.success(res, { about: updatedAbout }, 'About section updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Upload About Artwork / Featured Image
 * POST /api/v1/about/admin/upload-image
 */
export const uploadAboutImageHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return apiResponse.error(res, 'No image file uploaded. Please attach an image.', 400);
    }

    const fileUrl = `/uploads/about/${req.file.filename}`;

    return apiResponse.success(
      res,
      {
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      'About image uploaded successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};
