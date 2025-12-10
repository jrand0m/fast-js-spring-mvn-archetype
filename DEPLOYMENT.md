# Deployment to Maven Central

This archetype is configured to automatically deploy to Maven Central when changes are pushed to the `public` branch.

## Prerequisites

Before deployment can work, you need to:

1. **Create an account on Sonatype OSSRH** (https://central.sonatype.org/register/central-portal/)
   - Request access to publish under the `me.nd0.jra` groupId
   - Note your username and password

2. **Generate a GPG key** for signing artifacts:
   ```bash
   # Generate key
   gpg --full-generate-key

   # List keys to get the key ID
   gpg --list-secret-keys --keyid-format=long

   # Export private key (replace KEY_ID with your actual key ID)
   gpg --armor --export-secret-keys KEY_ID
   ```

3. **Publish your GPG public key** to key servers:
   ```bash
   gpg --keyserver keyserver.ubuntu.com --send-keys KEY_ID
   gpg --keyserver keys.openpgp.org --send-keys KEY_ID
   ```

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `OSSRH_USERNAME` | Your Sonatype OSSRH username | From your Sonatype account |
| `OSSRH_PASSWORD` | Your Sonatype OSSRH password | From your Sonatype account |
| `GPG_PRIVATE_KEY` | Your GPG private key | Output from `gpg --armor --export-secret-keys KEY_ID` |
| `GPG_PASSPHRASE` | Passphrase for your GPG key | The passphrase you set when creating the key |

## Deployment Process

### Automatic Deployment (Recommended)

1. **Merge changes to the `public` branch**:
   ```bash
   git checkout public
   git merge main  # or your feature branch
   git push origin public
   ```

2. **GitHub Actions will automatically**:
   - Build the archetype
   - Run verification tests
   - Sign artifacts with GPG
   - Deploy to Maven Central staging
   - Release to Maven Central (auto-release enabled)

3. **Monitor the workflow**:
   - Go to Actions tab in GitHub
   - Watch the "Publish to Maven Central" workflow

### Manual Release with Version Tag

To create a GitHub release alongside Maven Central deployment:

1. **Create and push a version tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **GitHub Actions will**:
   - Deploy to Maven Central (as above)
   - Create a GitHub Release with auto-generated release notes
   - Attach JAR and POM files to the release

## Verifying Deployment

After successful deployment:

1. **Check Maven Central**:
   - Search at https://central.sonatype.com/
   - Look for `me.nd0.jra:springboot-nextjs-archetype`
   - Note: It may take a few minutes to appear in search

2. **Test the archetype**:
   ```bash
   mvn archetype:generate \
     -DarchetypeGroupId=me.nd0.jra \
     -DarchetypeArtifactId=springboot-nextjs-archetype \
     -DarchetypeVersion=1.0.0 \
     -DgroupId=com.example \
     -DartifactId=test-app
   ```

## Troubleshooting

### Build Fails on Public Branch

- Check GitHub Actions logs for detailed error messages
- Verify all secrets are correctly configured
- Ensure GPG key hasn't expired

### GPG Signing Fails

- Verify `GPG_PRIVATE_KEY` secret contains the full armored key
- Ensure `GPG_PASSPHRASE` matches the key's passphrase
- Check that the key hasn't been revoked

### Nexus Staging Fails

- Verify OSSRH credentials are correct
- Ensure you have permission to publish under `me.nd0.jra` groupId
- Check that POM metadata (licenses, developers, SCM) is complete

## Local Testing

To test the release process locally before pushing:

```bash
# Install archetype locally
mvn clean install

# Test the release profile (requires GPG setup)
mvn clean verify -P release

# Test deployment to local staging (without actually deploying)
mvn clean deploy -P release -DaltDeploymentRepository=local::file:./target/staging
```

## Updating Deployment Configuration

The deployment is configured in:
- `.github/workflows/maven-publish.yml` - GitHub Actions workflow
- `pom.xml` - Maven Central metadata and release profile

Key configuration points:
- **Branch restriction**: Only `public` branch triggers deployment
- **Auto-release**: Artifacts automatically release after passing staging checks
- **Signing**: All artifacts are GPG signed for security

## Security Notes

- Never commit GPG keys or passwords to the repository
- Use GitHub Secrets for all sensitive credentials
- Rotate OSSRH passwords periodically
- Keep GPG keys backed up securely
- Consider using a dedicated GPG key for artifact signing
