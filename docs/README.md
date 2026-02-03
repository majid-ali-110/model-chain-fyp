# ModelChain Use Case Diagrams

This folder contains the complete use case documentation for the ModelChain platform.

## Files Overview

### Complete Documentation
- **use-case-diagram.puml** - Original comprehensive diagram with all 105 use cases (may be too wide to render)
- **use-cases-complete.txt** - Text documentation of all use cases with detailed descriptions

### Focused Diagrams (Recommended)
Split into 9 focused diagrams for better rendering and readability:

1. **use-case-diagram-overview.puml** - System architecture overview
   - Shows all actors and main system packages
   - Good starting point for understanding the system

2. **use-case-1-authentication.puml** - Authentication & Wallet Management (10 use cases)
   - Wallet connection (MetaMask, WalletConnect, Coinbase)
   - User onboarding
   - Wallet management features

3. **use-case-2-marketplace.puml** - Marketplace & Model Discovery (13 use cases)
   - Browsing and searching
   - Model details and metadata
   - Purchase and download

4. **use-case-3-user-dashboard.puml** - User Dashboard & Sandbox (18 use cases)
   - Profile management
   - Dashboard features
   - Sandbox testing environment

5. **use-case-4-developer.puml** - Developer Features (15 use cases)
   - Model upload workflow
   - Model management
   - Analytics and revenue tracking

6. **use-case-5-validator.puml** - Validator Quality Assurance (15 use cases)
   - Validation workflow
   - Quality checks
   - Rewards and leaderboard

7. **use-case-6-governance.puml** - DAO Governance (12 use cases)
   - Proposal management
   - Voting system
   - Treasury management

8. **use-case-7-admin.puml** - Admin Features (12 use cases)
   - Platform overview
   - User management
   - Content moderation
   - System administration

9. **use-case-8-documentation.puml** - Documentation & Support (10 use cases)
   - Developer docs
   - Validator guidelines
   - Legal policies
   - Help and support

## How to View Diagrams

### Option 1: Online PlantUML Viewer
1. Go to [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
2. Copy the content of any `.puml` file
3. Paste into the editor
4. View the rendered diagram

### Option 2: VS Code Extension
1. Install the "PlantUML" extension by jebbs
2. Open any `.puml` file
3. Press `Alt+D` or `Cmd+D` to preview

### Option 3: Command Line
```bash
# Install PlantUML
brew install plantuml

# Generate PNG from any diagram
plantuml use-case-1-authentication.puml

# This creates use-case-1-authentication.png
```

## Use Case Numbering

All use cases are numbered UC1-UC105 consistently across all files:

- **UC1-UC10**: Authentication & Wallet Management
- **UC11-UC23**: Marketplace & Model Discovery
- **UC24-UC31**: Sandbox & Model Testing
- **UC32-UC41**: User Dashboard & Profile
- **UC42-UC56**: Developer Features
- **UC57-UC71**: Validator Features
- **UC72-UC83**: Governance & DAO
- **UC84-UC95**: Admin Features
- **UC96-UC105**: Documentation & Support

## Actors

The system has 6 main actors:

1. **Visitor** - Unauthenticated user browsing the platform
2. **User** - Authenticated user with wallet connected
3. **Developer** - User who uploads models
4. **Validator** - User who validates model quality
5. **DAO Member** - Token holder with governance rights
6. **Admin** - Platform administrator

## Smart Contracts

The diagrams reference these deployed contracts on Polygon Amoy Testnet:

- **UserRegistry**: `0x88B072E8d297888a0099d687d238135b481E307D`
- **ModelRegistry**: `0x276BBe55C5163a3a7aD3057b35169eCcc344a5AC`
- **Marketplace**: `0x7e77a578Ad335D2a8459324d91d0a73d1E680b91`
- **Governance**: `0xfD1907A8B9Bb163dbbfaf656e1113565BaABe0AE`

## External Systems

- **Blockchain**: Polygon Amoy Testnet (Chain ID: 80002)
- **IPFS**: Model file storage via Pinata
- **Wallets**: MetaMask, WalletConnect, Coinbase Wallet

## Notes

- All diagrams use consistent styling and actor representations
- Each focused diagram is sized to render properly on standard displays
- Relationships (includes, extends) are shown with dashed arrows
- External system interactions are clearly marked
- Smart contract interactions are documented with notes

## Recommended Viewing Order

1. Start with **overview** to understand system architecture
2. View **authentication** to understand user onboarding
3. Check **marketplace** for the core user journey
4. Review role-specific diagrams based on your interest:
   - **developer** for model creators
   - **validator** for quality assurance
   - **governance** for DAO participation
   - **admin** for platform management

## Updates

Last updated: January 2025
Total use cases documented: 105
