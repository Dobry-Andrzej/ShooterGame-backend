import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Query, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('users')
    async getUsers(@Res() res) {
        const users = await this.userService.getUsers();
        return res.status(HttpStatus.OK).json(users);
    }

    @Get('user/:id')
    async getUser(@Res() res, @Param('id', new ValidateObjectId()) id) {
        const user = await this.userService.getUser(id);
        if (!user) {
            throw new NotFoundException('User does not exist!');
        }
        return res.status(HttpStatus.OK).json(user);
    }

    @Post('/add-user')
    async addUser(@Res() res, @Body() createUserDTO: CreateUserDTO) {
        const newUser = await this.userService.createUser(createUserDTO);
        return res.status(HttpStatus.OK).json({
            message: 'User added successfully!',
            user: newUser,
        });
    }

    @Put('/edit-user')
    async editUser(@Res() res, @Query('id', new ValidateObjectId()) id, @Body() createUserDTO: CreateUserDTO) {
        const editedUser = await this.userService.editUser(id, createUserDTO);
        if (!editedUser) {
            throw new NotFoundException('User does not exist!');
        }
        return res.status(HttpStatus.OK).json({
            message: 'Successfully edited!',
            user: editedUser,
        });
    }

    @Delete('/delete-user')
    async deleteUser(@Res() res, @Query('id', new ValidateObjectId()) id) {
        const deletedUser = await this.userService.deleteUser(id);
        if (!deletedUser) {
            throw new NotFoundException('User does not exist!');
        }
        return res.status(HttpStatus.OK).json({
            message: 'User has been deleted!',
            user: deletedUser,
        });
    }

}
