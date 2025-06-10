// packages/summarizer/src/interface/cli/main.ts
import { GreetingUseCase } from "../../usecase/greeting.usecase.js"; // .js拡張子に注意！

function main() {
	console.log("🚀 Summarizer starting up...");

	// ユースケースをインスタンス化
	const greetingUseCase = new GreetingUseCase();

	// ユースケースを実行
	const result = greetingUseCase.execute("Developer");

	// 結果を表示
	console.log("✅ Main process finished with result:");
	console.log(`\t-> "${result}"`);
}

// このファイルが直接実行されたときにmain関数を呼び出す
main();
