import { invariant } from '@epic-web/invariant'
import { faker } from '@faker-js/faker'
import { verifyUserPassword } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { readEmail } from '#tests/mocks/utils.ts'
import { expect, test, createUser, waitFor } from '#tests/playwright-utils.ts'

const CODE_REGEX = /Hier is je verificatiecode: (?<code>[\d\w]+)/

test('Users can update their basic info', async ({ page, login }) => {
	await login()
	await page.goto('/settings/profile')

	const newUserData = createUser()

	await page.getByRole('textbox', { name: /^name/i }).fill(newUserData.name)
	await page
		.getByRole('textbox', { name: /^username/i })
		.fill(newUserData.username)

	await page.getByRole('button', { name: /^save/i }).click()
})

test('Users can update their password', async ({ page, login }) => {
	const oldPassword = faker.internet.password()
	const newPassword = faker.internet.password()
	const user = await login({ password: oldPassword })
	await page.goto('/settings/profile')

	await page.getByRole('link', { name: /verander password/i }).click()

	await page
		.getByRole('textbox', { name: /^huidig password/i })
		.fill(oldPassword)
	await page
		.getByRole('textbox', { name: /^nieuw password/i })
		.fill(newPassword)
	await page
		.getByRole('textbox', { name: /^bevestig nieuw password/i })
		.fill(newPassword)

	await page.getByRole('button', { name: /^verander password/i }).click()

	await expect(page).toHaveURL(`/settings/profile`)

	const { username } = user
	expect(
		await verifyUserPassword({ username }, oldPassword),
		'Oud password werkt nog steeds',
	).toEqual(null)
	expect(
		await verifyUserPassword({ username }, newPassword),
		'Nieuw password werkt niet',
	).toEqual({ id: user.id })
})

test('Users can update their profile photo', async ({ page, login }) => {
	const user = await login()
	await page.goto('/settings/profile')

	const beforeSrc = await page
		.getByRole('img', { name: user.name ?? user.username })
		.getAttribute('src')

	await page.getByRole('link', { name: /change profile photo/i }).click()

	await expect(page).toHaveURL(`/settings/profile/photo`)

	await page
		.getByRole('textbox', { name: /change/i })
		.setInputFiles('./tests/fixtures/images/user/kody.png')

	await page.getByRole('button', { name: /save/i }).click()

	await expect(
		page,
		'Was not redirected after saving the profile photo',
	).toHaveURL(`/settings/profile`)

	const afterSrc = await page
		.getByRole('img', { name: user.name ?? user.username })
		.getAttribute('src')

	expect(beforeSrc).not.toEqual(afterSrc)
})

test('Users can change their email address', async ({ page, login }) => {
	const preUpdateUser = await login()
	const newEmailAddress = faker.internet.email().toLowerCase()
	expect(preUpdateUser.email).not.toEqual(newEmailAddress)
	await page.goto('/settings/profile')
	await page.getByRole('link', { name: /change email/i }).click()
	await page
		.getByRole('textbox', { name: /nieuw emailadres/i })
		.fill(newEmailAddress)
	await page.getByRole('button', { name: /verzend bevestiging/i }).click()
	await expect(page.getByText(/check je email/i)).toBeVisible()
	const email = await waitFor(() => readEmail(newEmailAddress), {
		errorMessage: 'Confirmation email was not sent',
	})
	invariant(email, 'Email was not sent')
	const codeMatch = email.text.match(CODE_REGEX)
	const code = codeMatch?.groups?.code
	invariant(code, 'Onboarding code not found')
	await page.getByRole('textbox', { name: /code/i }).fill(code)
	await page.getByRole('button', { name: /indienen/i }).click()
	await expect(page.getByText(/email aangepast/i)).toBeVisible()

	const updatedUser = await prisma.user.findUnique({
		where: { id: preUpdateUser.id },
		select: { email: true },
	})
	invariant(updatedUser, 'Updated user not found')
	expect(updatedUser.email).toBe(newEmailAddress)
	const noticeEmail = await waitFor(() => readEmail(preUpdateUser.email), {
		errorMessage: 'Notice email was not sent',
	})
	expect(noticeEmail.subject).toContain('aangepast')
})
