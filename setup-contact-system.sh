#!/bin/bash

# Contact System Setup Checklist
# Run this script or manually verify each step

echo "📋 Contact System Setup Checklist"
echo "=================================="
echo ""

# Check 1: Dependencies installed
echo "✓ Checking dependencies..."
if npm ls nodemailer > /dev/null 2>&1; then
    echo "  ✅ nodemailer is installed"
else
    echo "  ❌ nodemailer needs to be installed (npm install nodemailer)"
fi

# Check 2: Environment variables
echo ""
echo "✓ Environment Variables Checklist:"
if [ -f ".env.local" ]; then
    echo "  ✅ .env.local exists"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "  ✅ NEXT_PUBLIC_SUPABASE_URL is set"
    else
        echo "  ⚠️  NEXT_PUBLIC_SUPABASE_URL is missing"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_KEY" .env.local; then
        echo "  ✅ NEXT_PUBLIC_SUPABASE_KEY is set"
    else
        echo "  ⚠️  NEXT_PUBLIC_SUPABASE_KEY is missing"
    fi
    
    if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
        echo "  ✅ SUPABASE_SERVICE_ROLE_KEY is set"
    else
        echo "  ⚠️  SUPABASE_SERVICE_ROLE_KEY is missing (required for storing messages)"
    fi
    
    if grep -q "EMAIL_USER" .env.local; then
        echo "  ✅ EMAIL_USER is set (email notifications enabled)"
    else
        echo "  ℹ️  EMAIL_USER not set (email notifications optional)"
    fi
else
    echo "  ❌ .env.local file not found!"
    echo "  📝 Copy from .env.example and fill in your values"
fi

# Check 3: Database table
echo ""
echo "✓ Supabase Database Checklist:"
echo "  ℹ️  Run the migration at: supabase/migrations/001_create_contact_messages.sql"
echo "  📝 Steps:"
echo "     1. Go to Supabase Console > SQL Editor"
echo "     2. Create new query"
echo "     3. Copy contents of supabase/migrations/001_create_contact_messages.sql"
echo "     4. Run the query"

# Check 4: API Route
echo ""
echo "✓ API Route:"
if [ -f "app/api/contact/route.ts" ]; then
    echo "  ✅ app/api/contact/route.ts exists"
else
    echo "  ❌ app/api/contact/route.ts not found"
fi

# Check 5: Contact Component
echo ""
echo "✓ Contact Component:"
if [ -f "app/components/Contact.tsx" ]; then
    echo "  ✅ app/components/Contact.tsx exists"
else
    echo "  ❌ app/components/Contact.tsx not found"
fi

# Check 6: Contact Page
echo ""
echo "✓ Contact Page:"
if [ -f "app/contact/page.tsx" ]; then
    echo "  ✅ app/contact/page.tsx exists"
else
    echo "  ❌ app/contact/page.tsx not found"
fi

echo ""
echo "=================================="
echo "✨ Setup Guide: CONTACT_SYSTEM_SETUP.md"
echo ""
