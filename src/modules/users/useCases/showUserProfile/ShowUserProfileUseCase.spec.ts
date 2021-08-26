import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {
    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

        await createUserUseCase.execute({ name: 'Allyson Barros', email: 'a@a.com', password: '123456' });
    });

    it("Should be able to show a User", async () => {
        const user = await inMemoryUsersRepository.findByEmail('a@a.com');
        const response = await showUserProfileUseCase.execute(user!.id as string);

        expect(response).toEqual(user);
    });

    it("Should not be able to show a User Profile with wrong user_id", async () => {
        expect(async () => {
            const response = await showUserProfileUseCase.execute('abc123');
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });
})