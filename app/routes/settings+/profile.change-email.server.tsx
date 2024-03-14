import { invariant } from '@epic-web/invariant'
import * as E from '@react-email/components'
import { json } from '@remix-run/node'
import {
	requireRecentVerification,
	type VerifyFunctionArgs,
} from '#app/routes/_auth+/verify.server.ts'
import { APP_NAME } from '#app/utils/constants'
import { prisma } from '#app/utils/db.server.ts'
import { sendEmail } from '#app/utils/email.server.ts'
import { redirectWithToast } from '#app/utils/toast.server.ts'
import { verifySessionStorage } from '#app/utils/verification.server.ts'
import { newEmailAddressSessionKey } from './profile.change-email'

export async function handleVerification({
	request,
	submission,
}: VerifyFunctionArgs) {
	await requireRecentVerification(request)
	invariant(
		submission.status === 'success',
		'Submission should be successful by now',
	)

	const verifySession = await verifySessionStorage.getSession(
		request.headers.get('cookie'),
	)
	const newEmail = verifySession.get(newEmailAddressSessionKey)
	if (!newEmail) {
		return json(
			{
				result: submission.reply({
					formErrors: [
						'You must submit the code on the same device that requested the email change.',
					],
				}),
			},
			{ status: 400 },
		)
	}
	const preUpdateUser = await prisma.user.findFirstOrThrow({
		select: { email: true },
		where: { id: submission.value.target },
	})
	const user = await prisma.user.update({
		where: { id: submission.value.target },
		select: { id: true, email: true, username: true },
		data: { email: newEmail },
	})

	void sendEmail({
		to: preUpdateUser.email,
		subject: `${APP_NAME} email aangepast`,
		react: <EmailChangeNoticeEmail userId={user.id} />,
	})

	return redirectWithToast(
		'/settings/profile',
		{
			title: 'Email aangepast',
			type: 'success',
			description: `Je email is aangepast naar ${user.email}`,
		},
		{
			headers: {
				'set-cookie': await verifySessionStorage.destroySession(verifySession),
			},
		},
	)
}

export function EmailChangeEmail({
	verifyUrl,
	otp,
}: {
	verifyUrl: string
	otp: string
}) {
	return (
		<E.Html lang="en" dir="ltr">
			<E.Container>
				<h1>
					<E.Text>`${APP_NAME} Email aanpassing`</E.Text>
				</h1>
				<p>
					<E.Text>
						Hier is je verificatiecode: <strong>{otp}</strong>
					</E.Text>
				</p>
				<p>
					<E.Text>Of klik op de link:</E.Text>
				</p>
				<E.Link href={verifyUrl}>{verifyUrl}</E.Link>
			</E.Container>
		</E.Html>
	)
}

function EmailChangeNoticeEmail({ userId }: { userId: string }) {
	return (
		<E.Html lang="en" dir="ltr">
			<E.Container>
				<h1>
					<E.Text>`Je ${APP_NAME} email is veranderd`</E.Text>
				</h1>
				<p>
					<E.Text>
						`We informeren je dat je ${APP_NAME} email is veranderd.`
					</E.Text>
				</p>
				<p>
					<E.Text>
						Als je je emailaddes hebt veranderd dan kan je dit bericht negeren.
						But als je je emailadres niet hebt veranderd, neem dan contact op
						met de Support.
					</E.Text>
				</p>
				<p>
					<E.Text>Je Account ID: {userId}</E.Text>
				</p>
			</E.Container>
		</E.Html>
	)
}
