module.exports = {
   transform: {
   '^.+\\.[t|j]sx?$': 'babel-jest',// sorgt für JSX-Kompilierung
   },
   moduleNameMapper: { 
   '^.+\\.(jpg|jpeg|png|gif|webp|svg|css)$': 'jest-transform-stub' 
   }, 
   testEnvironment: 'jsdom', 
  testPathIgnorePatterns: ["<rootDir>/node_modules/"] 
 };
