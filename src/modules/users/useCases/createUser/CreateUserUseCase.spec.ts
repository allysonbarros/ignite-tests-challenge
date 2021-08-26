import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("Should be able to create a User", async () => {
        const createdUser = await createUserUseCase.execute({ name: 'Allyson Barros', email: 'a@a.com', password: '123456' });
        const inMemoryUser = await inMemoryUsersRepository.findByEmail('a@a.com');

        expect(createdUser).toEqual(inMemoryUser);
    });
})