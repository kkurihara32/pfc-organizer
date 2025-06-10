// packages/summarizer/src/usecase/greeting.usecase.ts
export class GreetingUseCase {
	execute(name: string): string {
		const message = `Hello, ${name}! Welcome to the Summarizer package.`;
		console.log("✨ UseCase executed!");
		return message;
	}
}
