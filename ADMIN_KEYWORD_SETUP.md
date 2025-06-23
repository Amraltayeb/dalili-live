# 🔧 Admin Keyword Management Setup

## 📋 Overview
This system allows admins to manage categorization keywords through a user-friendly dashboard instead of hardcoded arrays.

## 🗄️ Database Setup

### Step 1: Create Tables
Run the following SQL in your Supabase SQL Editor:

```sql
-- ============== CATEGORIZATION KEYWORDS TABLE ==============

CREATE TABLE IF NOT EXISTS categorization_keywords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  keyword VARCHAR(100) NOT NULL,
  region VARCHAR(50) DEFAULT 'global' NOT NULL,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100),
  UNIQUE(category_id, keyword, region)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_keywords_category_region ON categorization_keywords (category_id, region);
CREATE INDEX IF NOT EXISTS idx_keywords_active ON categorization_keywords (is_active);
CREATE INDEX IF NOT EXISTS idx_keywords_priority ON categorization_keywords (priority DESC);

-- ============== ADMIN SETTINGS TABLE ==============

CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'string',
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(100)
);
```

### Step 2: Seed Initial Keywords
```sql
-- Insert global restaurant keywords
INSERT INTO categorization_keywords (category_id, keyword, region, priority) 
SELECT c.id, keyword, 'global', priority
FROM categories c,
  (VALUES 
    ('restaurant', 5), ('food', 3), ('cafe', 4), ('bistro', 4), ('dining', 3),
    ('burger', 4), ('pizza', 4), ('grill', 3), ('kitchen', 2), ('eatery', 3),
    ('sandwich', 3), ('fast food', 4), ('diner', 3), ('bakery', 3), ('coffee', 3)
  ) AS keywords(keyword, priority)
WHERE c.name_en = 'Restaurants';

-- Insert global health keywords  
INSERT INTO categorization_keywords (category_id, keyword, region, priority)
SELECT c.id, keyword, 'global', priority
FROM categories c,
  (VALUES
    ('hospital', 5), ('medical', 4), ('clinic', 5), ('pharmacy', 5), ('doctor', 4),
    ('health', 3), ('dental', 4), ('dentist', 4), ('physician', 4), ('medicine', 3)
  ) AS keywords(keyword, priority)
WHERE c.name_en = 'Health & Medical';

-- Insert global automotive keywords
INSERT INTO categorization_keywords (category_id, keyword, region, priority)
SELECT c.id, keyword, 'global', priority  
FROM categories c,
  (VALUES
    ('auto', 4), ('car wash', 5), ('garage', 4), ('mechanic', 5), ('automotive', 4),
    ('car repair', 5), ('oil change', 4), ('tire', 3), ('service center', 4)
  ) AS keywords(keyword, priority)
WHERE c.name_en = 'Automotive';

-- Insert Egyptian-specific keywords
INSERT INTO categorization_keywords (category_id, keyword, region, priority)
SELECT c.id, keyword, 'egypt', priority
FROM categories c,
  (VALUES
    ('koshary', 5), ('sequoia', 5), ('abou tarek', 5), ('ful', 4), ('tamiya', 4)
  ) AS keywords(keyword, priority)
WHERE c.name_en = 'Restaurants';

-- Insert default admin settings
INSERT INTO admin_settings (setting_key, setting_value, setting_type, description, is_public)
VALUES 
  ('auto_detect_region', 'true', 'boolean', 'Automatically detect business region for keyword matching', FALSE),
  ('default_region', 'global', 'string', 'Default region to use when region cannot be detected', FALSE),
  ('keyword_matching_enabled', 'true', 'boolean', 'Enable automatic keyword-based categorization', FALSE),
  ('min_keyword_length', '2', 'number', 'Minimum length for keyword matching', FALSE);
```

### Step 3: Add Triggers (Optional)
```sql
-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
CREATE TRIGGER update_keywords_updated_at 
    BEFORE UPDATE ON categorization_keywords 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🎯 Features

### ✅ Implemented
- **Admin Dashboard**: `/admin/keywords` - Full CRUD for keywords
- **Region Support**: Global, Egypt, USA, UK, India + easy to add more
- **Priority System**: 1-5 scale for keyword importance
- **Active/Inactive**: Toggle keywords without deleting
- **Smart Categorization**: Automatically detects business region
- **Integration**: Updated fix-categories page uses DB keywords

### 🔧 Admin Controls
- **Add Keywords**: Create new keywords for any category/region
- **Edit Keywords**: Modify existing keywords, change priority
- **Delete Keywords**: Remove unwanted keywords
- **Toggle Status**: Enable/disable without deleting
- **Filter & Search**: By region, category, status
- **Bulk Operations**: Clear all categories, batch processing

### 🌍 Region Support
- **Global**: Universal keywords (restaurant, hospital, etc.)
- **Egypt**: Local terms (koshary, sequoia, abou tarek)
- **USA**: American-specific terms
- **UK**: British-specific terms
- **India**: Indian-specific terms
- **Extensible**: Easy to add new regions

## 🚀 Usage

### For Admins
1. Visit `/admin/keywords`
2. Add/edit keywords for each category
3. Set appropriate regions and priorities
4. Test using `/fix-categories`

### For Developers
```typescript
// Get keywords for a region
const keywords = await getCategorizationKeywords('egypt');

// Auto-categorize a business
await autoCategorizeBusiness(businessId, 'egypt');

// Batch operations
const result = await autoCategorizeBatch(businessIds);
```

## 🎨 Benefits
- **No Code Changes**: Add keywords without touching code
- **Global Ready**: Support for any country/region
- **Scalable**: Handles thousands of keywords efficiently
- **Admin Friendly**: Beautiful UI for non-technical users
- **Smart**: Automatic region detection
- **Flexible**: Priority system for fine-tuning

## 🔮 Future Enhancements
- Keyword analytics (match rates, effectiveness)
- AI-suggested keywords based on business descriptions
- Import/export keyword sets
- A/B testing for categorization strategies
- Multi-language keyword support 