#!/usr/bin/env python3
"""
Generate 1,000 realistic tech internship records for Indian students.
Output: internships_1000.csv

This script generates a CSV file matching the Supabase internships table schema with:
- Realistic tech roles and companies
- Indian locations and relevant sectors
- Valid JSON arrays for skills and education requirements
- Realistic stipends and durations
"""

import csv
import json
import random
from datetime import datetime


# Define data pools
TECH_ROLES = [
    "Software Development Intern",
    "Data Analyst Intern",
    "Machine Learning Intern",
    "Frontend Developer Intern",
    "Cloud & DevOps Intern",
    "Cybersecurity Analyst Intern",
    "UI/UX Design Intern",
    "Mobile App Developer Intern",
    "Full Stack Developer Intern",
    "Backend Developer Intern",
    "Python Developer Intern",
    "Data Science Intern",
    "Quality Assurance Intern",
    "Business Analyst Intern",
    "Database Administrator Intern",
    "Network Engineer Intern",
    "Solutions Architect Intern",
    "Product Manager Intern",
    "AI/ML Engineer Intern",
    "Cloud Architect Intern",
]

TECH_COMPANIES = [
    # MNCs
    "IBM India",
    "Microsoft India",
    "Google India",
    "Amazon India",
    "Apple India",
    "Intel India",
    "Cisco Systems India",
    "Oracle India",
    "Accenture India",
    "TCS (Tata Consultancy Services)",
    "Infosys",
    "Wipro",
    "HCL Technologies",
    "Cognizant",
    "Tech Mahindra",
    # Indian Unicorns
    "Flipkart",
    "Swiggy",
    "Paytm",
    "Zomato",
    "Razorpay",
    "Ola Electric",
    "Unacademy",
    "Vedantu",
    "PolicyBazaar",
    "Freshworks",
    # AI/ML Startups
    "ABC Tech",
    "Insight Analytics",
    "NeuroByte AI",
    "CloudStack Infra",
    "SecureNet India",
    "PixelCraft Studios",
    "DataDrive Solutions",
    "ByteForce Labs",
    "CloudNine Dynamics",
    "SmartAI Innovations",
    "TechVision Labs",
    "InnovateTech",
    "FutureCode Systems",
    "QuantumLeap AI",
    "DeepMind India",
    "NeuroTech Solutions",
    "CodeWave Analytics",
    "VectorShift AI",
    "SynergyAI Systems",
    "ProdigyTech Labs",
]

SECTORS = [
    "IT & Software",
    "Artificial Intelligence",
    "Data Analytics",
    "E-commerce",
    "FinTech",
    "Cybersecurity",
    "EdTech",
    "Cloud Computing",
]

LOCATIONS = [
    "Mumbai",
    "Bengaluru",
    "Pune",
    "Delhi NCR",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Remote",
]

WORK_MODES = ["Remote", "Hybrid", "On-site"]

DURATIONS = [
    "2 Months",
    "3 Months",
    "6 Months",
    "1 Month",
]

STIPENDS = [
    "₹10,000 / Month",
    "₹12,000 / Month",
    "₹15,000 / Month",
    "₹18,000 / Month",
    "₹20,000 / Month",
    "₹25,000 / Month",
    "₹30,000 / Month",
    "₹5,000 / Month",
]

DEGREE_OPTIONS = [
    "B.Tech",
    "BCA",
    "MCA",
    "B.Sc CS",
]

BATCH_OPTIONS = [
    "2025",
    "2026",
    "2027",
    "2028",
]

# Skill pools based on role
ROLE_SKILL_MAPPING = {
    "Software Development Intern": {
        "required": ["Python", "Java", "C++", "Git", "Data Structures"],
        "preferred": ["REST APIs", "SQL", "Docker", "AWS", "Linux"],
    },
    "Data Analyst Intern": {
        "required": ["SQL", "Excel", "Python", "Data Visualization", "Statistics"],
        "preferred": ["Tableau", "Power BI", "R", "Python", "Apache Spark"],
    },
    "Machine Learning Intern": {
        "required": ["Python", "Machine Learning", "Statistics", "TensorFlow", "scikit-learn"],
        "preferred": ["Deep Learning", "PyTorch", "NLP", "Computer Vision", "AWS"],
    },
    "Frontend Developer Intern": {
        "required": ["JavaScript", "HTML", "CSS", "React", "Git"],
        "preferred": ["TypeScript", "Vue.js", "Redux", "REST APIs", "Figma"],
    },
    "Cloud & DevOps Intern": {
        "required": ["Linux", "Docker", "AWS", "Python", "Git"],
        "preferred": ["Kubernetes", "CI/CD", "Terraform", "Azure", "Jenkins"],
    },
    "Cybersecurity Analyst Intern": {
        "required": ["Network Security", "Linux", "Python", "Firewall", "Encryption"],
        "preferred": ["Penetration Testing", "SIEM", "Wireshark", "Metasploit", "AWS"],
    },
    "UI/UX Design Intern": {
        "required": ["Figma", "UI Design", "UX Research", "Wireframing", "Prototyping"],
        "preferred": ["Adobe XD", "Sketch", "User Testing", "Design Systems", "CSS"],
    },
    "Mobile App Developer Intern": {
        "required": ["Java", "Kotlin", "Android", "React Native", "Git"],
        "preferred": ["Swift", "iOS", "Firebase", "REST APIs", "SQLite"],
    },
    "Full Stack Developer Intern": {
        "required": ["JavaScript", "React", "Node.js", "SQL", "Git"],
        "preferred": ["MongoDB", "Express.js", "Docker", "AWS", "REST APIs"],
    },
    "Backend Developer Intern": {
        "required": ["Python", "Java", "SQL", "REST APIs", "Git"],
        "preferred": ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "Docker"],
    },
    "Python Developer Intern": {
        "required": ["Python", "Data Structures", "OOP", "SQL", "Git"],
        "preferred": ["Django", "Flask", "FastAPI", "PostgreSQL", "Docker"],
    },
    "Data Science Intern": {
        "required": ["Python", "Statistics", "Machine Learning", "SQL", "Pandas"],
        "preferred": ["TensorFlow", "scikit-learn", "R", "Tableau", "AWS"],
    },
    "Quality Assurance Intern": {
        "required": ["Manual Testing", "Test Cases", "Bug Tracking", "SQL", "Python"],
        "preferred": ["Selenium", "Automation Testing", "JIRA", "LoadRunner", "Linux"],
    },
    "Business Analyst Intern": {
        "required": ["Business Analysis", "SQL", "Excel", "Communication", "Documentation"],
        "preferred": ["JIRA", "Tableau", "Requirements Gathering", "Process Mapping", "Python"],
    },
    "Database Administrator Intern": {
        "required": ["SQL", "Database Design", "MySQL", "PostgreSQL", "Linux"],
        "preferred": ["MongoDB", "Oracle", "Backup & Recovery", "Performance Tuning", "AWS"],
    },
    "Network Engineer Intern": {
        "required": ["Networking", "Linux", "TCP/IP", "Routing", "Switching"],
        "preferred": ["Cisco IOS", "Network Security", "Firewalls", "VPN", "Python"],
    },
    "Solutions Architect Intern": {
        "required": ["Cloud Architecture", "AWS", "System Design", "SQL", "Documentation"],
        "preferred": ["Azure", "GCP", "Docker", "Kubernetes", "Python"],
    },
    "Product Manager Intern": {
        "required": ["Product Strategy", "Market Analysis", "Communication", "SQL", "Excel"],
        "preferred": ["Analytics", "User Research", "Roadmapping", "A/B Testing", "Python"],
    },
    "AI/ML Engineer Intern": {
        "required": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "Statistics"],
        "preferred": ["PyTorch", "NLP", "Computer Vision", "Reinforcement Learning", "AWS"],
    },
    "Cloud Architect Intern": {
        "required": ["AWS", "Cloud Architecture", "System Design", "Linux", "Networking"],
        "preferred": ["Azure", "GCP", "Kubernetes", "Docker", "Terraform"],
    },
}

# Default mapping for roles not explicitly mapped
DEFAULT_SKILLS = {
    "required": ["Python", "Git", "Problem Solving", "Communication"],
    "preferred": ["AWS", "Docker", "SQL", "REST APIs"],
}


def get_skills_for_role(role):
    """Get required and preferred skills for a given role."""
    if role in ROLE_SKILL_MAPPING:
        return ROLE_SKILL_MAPPING[role]
    return DEFAULT_SKILLS


def generate_description(role, company):
    """Generate a realistic 2-sentence description."""
    descriptions = {
        "Software Development Intern": f"Join {company}'s development team and contribute to building scalable software solutions using modern technologies. You will work on real-world projects, collaborate with experienced engineers, and gain hands-on experience in the full software development lifecycle.",
        "Data Analyst Intern": f"Work with {company}'s data team to analyze business metrics and create actionable insights. You'll develop data visualizations, write SQL queries, and support data-driven decision-making across the organization.",
        "Machine Learning Intern": f"Contribute to {company}'s AI initiatives by developing and training machine learning models on real datasets. You'll work alongside ML engineers to solve complex problems and implement cutting-edge algorithms.",
        "Frontend Developer Intern": f"Build responsive and interactive user interfaces for {company}'s web applications using modern frameworks. You'll collaborate with designers and backend developers to deliver engaging user experiences.",
        "Cloud & DevOps Intern": f"Support {company}'s cloud infrastructure and deployment pipelines using DevOps best practices. You'll work on containerization, CI/CD automation, and cloud platform management.",
        "Cybersecurity Analyst Intern": f"Help {company} protect its digital assets by analyzing security threats and implementing protective measures. You'll participate in security audits, vulnerability assessments, and incident response activities.",
        "UI/UX Design Intern": f"Create beautiful and intuitive user interfaces for {company}'s digital products. You'll conduct user research, create prototypes, and collaborate with developers to bring designs to life.",
        "Mobile App Developer Intern": f"Develop mobile applications for iOS or Android platforms at {company}. You'll work on feature development, testing, and optimization to deliver high-quality mobile experiences.",
        "Full Stack Developer Intern": f"Build complete web applications at {company} by working on both frontend and backend technologies. You'll gain experience across the entire development stack and learn best practices in web development.",
        "Backend Developer Intern": f"Design and develop server-side logic and APIs for {company}'s applications. You'll work with databases, optimize performance, and ensure scalability of backend systems.",
        "Python Developer Intern": f"Write clean and efficient Python code for {company}'s projects and applications. You'll learn Python best practices and contribute to building robust software solutions.",
        "Data Science Intern": f"Apply statistical methods and machine learning techniques to solve business problems for {company}. You'll work with large datasets, build predictive models, and communicate insights to stakeholders.",
        "Quality Assurance Intern": f"Ensure software quality at {company} by designing test cases and identifying bugs before release. You'll perform manual testing, create automation scripts, and maintain quality standards.",
        "Business Analyst Intern": f"Work with {company}'s stakeholders to gather requirements and improve business processes. You'll create documentation, analyze workflows, and support project implementation.",
        "Database Administrator Intern": f"Manage and optimize {company}'s databases to ensure performance and reliability. You'll handle backups, security, and database maintenance tasks.",
        "Network Engineer Intern": f"Support {company}'s network infrastructure by configuring and maintaining network systems. You'll work on network security, connectivity, and performance optimization.",
        "Solutions Architect Intern": f"Design comprehensive IT solutions for {company}'s clients and internal needs. You'll evaluate technologies, create architecture diagrams, and present recommendations.",
        "Product Manager Intern": f"Support {company}'s product team in developing and launching successful products. You'll conduct market research, analyze user feedback, and contribute to product strategy.",
        "AI/ML Engineer Intern": f"Advance {company}'s AI capabilities by developing intelligent systems and algorithms. You'll experiment with new techniques, optimize models, and solve complex AI problems.",
        "Cloud Architect Intern": f"Design scalable and secure cloud solutions for {company}'s applications and infrastructure. You'll work with cloud platforms, optimize costs, and ensure high availability.",
    }
    return descriptions.get(role, f"Join {company}'s team and contribute to exciting technology projects. You'll develop professional skills while working on meaningful assignments alongside experienced mentors.")


def generate_eligibility():
    """Generate eligibility criteria."""
    degrees = random.sample(DEGREE_OPTIONS, random.randint(2, 3))
    batches = random.sample(BATCH_OPTIONS, random.randint(2, 3))
    degrees_str = ", ".join(degrees)
    batches_str = ", ".join(sorted(batches))
    return f"Open to {degrees_str} students ({batches_str} batches)"


def generate_education_requirements():
    """Generate education requirements as JSON array string."""
    education = random.sample(DEGREE_OPTIONS, random.randint(2, 3))
    return json.dumps(education)


def generate_record(record_id):
    """Generate a single internship record."""
    role = random.choice(TECH_ROLES)
    company = random.choice(TECH_COMPANIES)
    sector = random.choice(SECTORS)
    location = random.choice(LOCATIONS)
    work_mode = random.choice(WORK_MODES)
    duration = random.choice(DURATIONS)
    stipend = random.choice(STIPENDS)
    
    # Get skills for the role
    skills = get_skills_for_role(role)
    required_skills = json.dumps(random.sample(skills["required"], min(3, len(skills["required"]))))
    preferred_skills = json.dumps(random.sample(skills["preferred"], min(3, len(skills["preferred"]))))
    
    education_requirements = generate_education_requirements()
    
    description = generate_description(role, company)
    eligibility = generate_eligibility()
    
    # Generate realistic application URL
    company_slug = company.lower().replace(" ", "-").replace("(", "").replace(")", "")
    application_url = f"https://careers.{company_slug}.com/apply/internship-{record_id}"
    
    return {
        "title": role,
        "company": company,
        "sector": sector,
        "location": location,
        "work_mode": work_mode,
        "description": description,
        "eligibility": eligibility,
        "required_skills": required_skills,
        "preferred_skills": preferred_skills,
        "education_requirements": education_requirements,
        "duration": duration,
        "stipend": stipend,
        "application_url": application_url,
        "source": "Demo Dataset",
    }


def main():
    """Generate 1,000 internship records and write to CSV."""
    print("Generating 1,000 tech internship records for Indian students...")
    
    csv_filename = "internships_1000.csv"
    fieldnames = [
        "title",
        "company",
        "sector",
        "location",
        "work_mode",
        "description",
        "eligibility",
        "required_skills",
        "preferred_skills",
        "education_requirements",
        "duration",
        "stipend",
        "application_url",
        "source",
    ]
    
    try:
        with open(csv_filename, "w", newline="", encoding="utf-8") as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for record_id in range(1, 1001):
                record = generate_record(record_id)
                writer.writerow(record)
                
                if record_id % 100 == 0:
                    print(f"  Generated {record_id} records...")
        
        print(f"\n✓ Successfully generated {csv_filename} with 1,000 records")
        print(f"  File location: {csv_filename}")
        print(f"  File size: {get_file_size(csv_filename)}")
        print("\nSample record (first data row):")
        print_sample_record()
        
    except Exception as e:
        print(f"✗ Error generating CSV: {e}")
        raise


def get_file_size(filename):
    """Get human-readable file size."""
    import os
    size_bytes = os.path.getsize(filename)
    for unit in ["B", "KB", "MB"]:
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} GB"


def print_sample_record():
    """Print a sample generated record for verification."""
    record = generate_record(1)
    print("\n  Title:", record["title"])
    print("  Company:", record["company"])
    print("  Sector:", record["sector"])
    print("  Location:", record["location"])
    print("  Work Mode:", record["work_mode"])
    print("  Duration:", record["duration"])
    print("  Stipend:", record["stipend"])
    print("  Required Skills:", record["required_skills"])
    print("  Preferred Skills:", record["preferred_skills"])
    print("  Education Requirements:", record["education_requirements"])


if __name__ == "__main__":
    main()
