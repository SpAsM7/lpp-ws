# Refactor PRD Prompt for o1

You are my software architect. We will be using a tool called Cursor - to build this entire project. Imagine Cursor to be like an LLM - where you give instructions to it, and it will write the code for you.  When using Cursor, it is important to have a files that keep it on track. Cursor is a genius when it comes to coding but it unfortunately has a very short memory. 

I have developed a first draft of a PRD for our app. It was merged from several sources so needs to be refactored. The smaller the file is, the easier Cursor can adhere to it. That said, I believe most of these descriptions are necessary.

Can you review and see if we can do any refactoring to make the PRD file more concise and easier to digest for Cursor without losing any content? Please respond with the fully complete markdown file that includes all your suggested refactoring. The current draft is below.

---CURRENT DRAFT OF PRD---

# Refactpr Rules Prompt for o1

You are my software architect. We will be using a tool called Cursor - to build this entire project. Imagine Cursor to be like an LLM - where you give instructions to it, and it will write the code for you.  When using Cursor, it is important to have a rules file that keeps Cursor in line to maintain clean code that is easily digestible by an LLM. This rules document will be sent to Cursor (an LLM which will write code) at every request. Cursor is a genius when it comes to coding but it unfortunately has a very short memory. Without a coding rules file, Cursor will forget which conventions we have been using, where it put files and what standards we picked.

I have developed a near final rules file after many iterations, which is below. As is common, it expanded quite a bit during my drafting and now we need to see if we need to refactor it. The smaller the rules file is, the easier Cursor can adhere to it. That said, I believe most of these rule are necessary.

Can you review and see if we can do any refactoring to make the rules file more concise and easier to digest for Cursor without losing any content? Please respond with the fully complete markdown file that includes all your suggested refactoring.

---CURRENT DRAFT OF RULES FILE---

# Develop Rules Prompt for o1

You are my software architect. You will help me write down specific rules and requirements for a coding rules document. Do not provide code unless absolutely necessary and only as an example.  We will be using a tool called Cursor - to build this entire project. Imagine Cursor to be like an LLM - where you give instructions to it, and it will write the code for you.  I need you to be my software architect and help me write down the key rules that Cursor must operate by to maintain clean code that is easily digestible by an LLM. This rules document will be sent to Cursor (an LLM which will write code) at every request. Cursor is a genius when it comes to coding but it unfortunately has a very short memory. Without a coding rules file, Cursor will forget which conventions we have been using, where it put files and what standards we picked. Therefore, we need to develop this rules document to ensure Cursor builds quality code across a large codebase.

I am pasting below my current draft of the rules file as a starting point. For your reference, I have also found the following pirnciples enhances Cursors development quality:

1) Write rules that are explicit, concise and declarative
2) Smaller files are better as Cursor gets lost in larger files
3) Constant reminders throughout the code base help so long as they are not overly verbose or conflict with other rules
3) Rules must not explicitly or implicitly conflict. This is a must.
4) Ambiguity must be mitigated as much as possible
5) Code design and organization should be chosen based in ease of adherence to rules.
6) Lastly, after all other rules have been followed, the default should then be convention and best practice as Cursor is an expert programmer and best practices are a natural state for it.

Please propose changes to my draft rules file that I should consider or key questions you need from me if I have not provided enough detail in order for you to recommend a change. If we need to discuss higher level decisions first, then start there.

---CURRENT DRAFT OF RULES FILE---

# Develop additional files for o1

You are my software architect. You will help me write down specific requirements for a documents that we'll use as a guide to build an app. Do not provide code unless absolutely necessary and only as an example. 

We will be using a tool called Cursor - to build this entire project. Imagine Cursor to be like an LLM - where you give instructions to it, and it will write the code for you.  I need you to be my software architect and help me develop documents that Cursor must use to build and maintain code that is easily digestible by an LLM. These documents will be the primary framework used by Cursor (an LLM which will write code) to create each piece of the app. 

Cursor is a genius when it comes to coding but it unfortunately has a very short memory. Without reference files, Cursor will forget where we are in the build process, how it was implementing features, which conventions we have been using, where it put files and what standards we picked. Therefore, we use a series of files to keep it on track so quality and efficiency is maintained. The files that we use to keep it on track are:

1) A product-requirements.md file that provides a high level PRD-like overview of the project. This has been pasted below for your reference.
2) A coding-rules.md file that is included with every prompt to constantly remind Cursor of the tech stack we're using, file locations, conventions and methods, styles, etc.
3) A components-requirements.md file that breaks down the entire app into smaller 'bites' that can be completed 1-by-1 so Cursor can stay on track and not get lost. This is a variation on the traditional implementation guide but is more component and functionality oriented for LLMs to implement.
4) A visual mermaid-type app flow guide that reinforces the general flow of the app and a key complement to the product-requirements.md file.
5) A working-status.md file that is constantly updated with the current status of feature or functional implementation.

For your reference, I have also found the following principles enhance Cursors development quality:


1) Write in a manor that is explicit, concise and declarative 
2) Smaller files are better as Cursor gets lost in larger files. With larger instruction files, using logical organization with a reference hierarchy (e.g. 1.1.2 or 3.1.3.) helps
3) Constant reminders throughout the code base help so long as they are not overly verbose or conflict with other rules
3) Rules must not explicitly or implicitly conflict. This is a must.
4) Ambiguity must be mitigated as much as possible
5) Code design and organization should be chosen based on ease of adherence to rules. 
6) Lastly, after all other rules have been followed, the default should then be convention and best practice as Cursor is an expert programmer and best practices are a natural state for it.


We have currently drafted the product-requirements.md file. I have pasted the contents of this file below. No other files have been drafted yet. I think the next file we should draft is the coding-rules.md file because this file provides the key mental framework for Cursor to operate. We also have a well developed reference coding-rules.md file that we can start from. I have an old coding-rules.md that contemplated the exact project we are doing, albeit using Supabase as the sole database. Our current project maintains Supabase for auth, but moves the primary database to Airtable.

Please propose changes to the draft rules file given our project change to using Airtable as the primary database. Reference the product-requirements.md document pasted below. If I have not provided enough detail or if we need to discuss higher level decisions first, then ask first. Otherwise, reproduce a comprehensive coding-rules.md file for the changes we need.


---CURRENT DRAFT OF PRODUCT-REQUIREMENTS.MD FILE---

--REFERENCE CODING-RULES.MD FILE THAT HAS NOT BEEN UPDATED FOR AIRTABLE---

# Develop app flow prompt for o1

You are my software architect. You will help me write down specific requirements for a documents that we'll use as a guide to build an app. Do not provide code unless absolutely necessary and only as an example. 

We will be using a tool called Cursor - to build this entire project. Imagine Cursor to be like an LLM - where you give instructions to it, and it will write the code for you.  I need you to be my software architect and help me develop documents that Cursor must use to build and maintain code that is easily digestible by an LLM. These documents will be the primary framework used by Cursor (an LLM which will write code) to create each piece of the app. 

Cursor is a genius when it comes to coding but it unfortunately has a very short memory. Without reference files, Cursor will forget where we are in the build process, how it was implementing features, which conventions we have been using, where it put files and what standards we picked. Therefore, we use a series of files to keep it on track so quality and efficiency is maintained.

The files that we use to keep it on track are: 

1) A product-requirements.md file that provides a high level PRD-like overview of the project. This has been pasted below for your reference.
2) A coding-rules.md file that is included with every prompt to constantly remind Cursor of the tech stack we're using, file locations, conventions and methods, styles, etc.
3) A components-requirements.md file that breaks down the entire app into smaller 'bites' that can be completed 1-by-1 so Cursor can stay on track and not get lost. This is a variation on the traditional implementation guide but is more component and functionality oriented for LLMs to implement.
4) A visual mermaid-type app flow guide that reinforces the general flow of the app and a key complement to the product-requirements.md file.
5) A working-status.md file that is constantly updated with the current status of feature or functional implementation.

For your reference, I have also found the following principles enhance Cursors development quality:

1) Write in a manor that is explicit, concise and declarative 
2) Smaller files are better as Cursor gets lost in larger files. With larger instruction files, using logical organization with a reference hierarchy (e.g. 1.1.2 or 3.1.3.) helps
3) Constant reminders throughout the code base help so long as they are not overly verbose or conflict with other rules
3) Rules must not explicitly or implicitly conflict. This is a must.
4) Ambiguity must be mitigated as much as possible
5) Code design and organization should be chosen based on ease of adherence to rules. 
6) Lastly, after all other rules have been followed, the default should then be convention and best practice as Cursor is an expert programmer and best practices are a natural state for it.

We have currently drafted the product-requirements.md file and the coding-rules.md file. I have pasted the contents of both files below. No other files have been drafted yet. I think the next file we should draft is the visual app flow diagram using mermaid or something similar.

Please develop a draft in its entirety for me to review. Reference the product-requirements.md document and the coding-rules.md document pasted below. If I have not provided enough detail or if we need to discuss higher level decisions first, then ask first. 

Otherwise, reproduce a comprehensive file for me. 

---CURRENT PRODUCT-REQUIREMENTS.MD FILE---

--CURRENT CODING-RULES.MD FILE---