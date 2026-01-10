#!/usr/bin/env python3
"""
Script to update handleAdd functions to support edit mode
"""

import re
import sys

def update_handle_add_deck(content):
    """Update handleAddDeck to support editing"""
    pattern = r'(  const handleAddDeck = async \(\) => \{.*?    setUploadingDeck\(true\);.*?    try \{.*?)(      const \{ error \} = await supabase\s+\.from\("candidate_experience" as any\)\s+\.insert\(\{)'
    
    replacement = r'''\1      if (editingDeckId) {
        // Update existing record
        const updateData: any = {
          vessel_name_type: newDeck.vessel_name_type,
          gt_loa: newDeck.gt_loa,
          route: newDeck.route,
          position: newDeck.position,
          start_date: newDeck.start_date || null,
          end_date: newDeck.end_date || null,
          reason: newDeck.reason,
          job_description: newDeck.job_description,
        };
        
        if (filePath) {
          updateData.file_path = filePath;
          updateData.file_name = fileName;
        }
        
        const { error } = await supabase
          .from("candidate_experience" as any)
          .update(updateData)
          .eq("id", editingDeckId);
          
        if (error) throw error;
        toast({ title: "Deck experience updated" });
        setEditingDeckId(null);
      } else {
        // Insert new record
        \2'''
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Also need to add closing brace for the else block
    pattern2 = r'(      if \(error\) throw error;\s+toast\(\{ title: "Deck experience added" \}\);)'
    replacement2 = r'''      if (error) throw error;
        toast({ title: "Deck experience added" });
      }'''
    
    content = re.sub(pattern2, replacement2, content)
    
    return content

# Read the file
with open('src/pages/candidate/Profile.tsx', 'r') as f:
    content = f.read()

# Apply updates
content = update_handle_add_deck(content)

# Write back
with open('src/pages/candidate/Profile.tsx', 'w') as f:
    f.write(content)

print("✓ Updated handleAddDeck")
