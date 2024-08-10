import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface SearchParamProps {
    params: {
        id: string;
    };
}

const Document = async ({ params: { id } }: SearchParamProps) => {
    const clerkUser = await currentUser();
    if (!clerkUser || !clerkUser.emailAddresses || !clerkUser.emailAddresses[0]) {
        redirect('/sign-in');
        return null;
    }

    const userEmail = clerkUser.emailAddresses[0].emailAddress;
    const room = await getDocument({
        roomId: id,
        userId: userEmail,
    });

    if (!room) {
        redirect('/');
        return null;
    }

    const userIds = Object.keys(room.usersAccesses || {});
    const users = await getClerkUsers({ userIds });

    const usersData = users.map((user: User | null) => {
        if (!user || !user.email) return null;
        return {
            ...user,
            userType: room.usersAccesses[user.email]?.includes('room:write')
                ? 'editor'
                : 'viewer',
        };
    }).filter((user: null) => user !== null);

    const currentUserType = room.usersAccesses?.[userEmail]?.includes('room:write') ? 'editor' : 'viewer';

    return (
        <main className="flex w-full flex-col items-center">
            <CollaborativeRoom
                roomId={id}
                roomMetadata={room.metadata}
                users={usersData}
                currentUserType={currentUserType}
            />
        </main>
    );
}

export default Document;
