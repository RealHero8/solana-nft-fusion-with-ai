use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount, Transfer},
    metadata::{
        create_metadata_accounts_v3, CreateMetadataAccountsV3, Metadata,
        create_master_edition_v3, CreateMasterEditionV3,
    },
};
use mpl_token_metadata::{
    instruction::create_metadata_accounts_v3 as mpl_create_metadata_accounts_v3,
    instruction::create_master_edition_v3 as mpl_create_master_edition_v3,
};

declare_id!("FusionNFT111111111111111111111111111111111111");

#[program]
pub mod nft_fusion {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let fusion_state = &mut ctx.accounts.fusion_state;
        fusion_state.authority = ctx.accounts.authority.key();
        fusion_state.bump = *ctx.bumps.get("fusion_state").unwrap();
        fusion_state.total_fusions = 0;
        fusion_state.total_revenue = 0;
        Ok(())
    }

    pub fn buy_nft(
        ctx: Context<BuyNft>,
        price: u64,
        nft_name: String,
        nft_symbol: String,
        nft_uri: String,
    ) -> Result<()> {
        // Transfer tokens from buyer to seller
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.buyer_token_account.to_account_info(),
                to: ctx.accounts.seller_token_account.to_account_info(),
                authority: ctx.accounts.buyer.to_account_info(),
            },
        );
        anchor_spl::token::transfer(transfer_ctx, price)?;

        // Create NFT mint
        let mint = &mut ctx.accounts.nft_mint;
        mint.mint_authority = Some(ctx.accounts.authority.key());
        mint.freeze_authority = Some(ctx.accounts.authority.key());

        // Create metadata
        let metadata_accounts = CreateMetadataAccountsV3 {
            metadata: ctx.accounts.metadata.to_account_info(),
            mint: ctx.accounts.nft_mint.to_account_info(),
            mint_authority: ctx.accounts.authority.to_account_info(),
            payer: ctx.accounts.buyer.to_account_info(),
            update_authority: ctx.accounts.authority.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: Some(ctx.accounts.rent.to_account_info()),
        };

        let creator = vec![mpl_token_metadata::state::Creator {
            address: ctx.accounts.authority.key(),
            verified: true,
            share: 100,
        }];

        let data_v2 = mpl_token_metadata::state::DataV2 {
            name: nft_name,
            symbol: nft_symbol,
            uri: nft_uri,
            seller_fee_basis_points: 500, // 5%
            creators: Some(creator),
            collection: None,
            uses: None,
        };

        create_metadata_accounts_v3(
            CpiContext::new(
                ctx.accounts.metadata_program.to_account_info(),
                metadata_accounts,
            ),
            data_v2,
            true,
            true,
            None,
            None,
            None,
        )?;

        // Mint NFT to buyer
        let buyer_ata = &mut ctx.accounts.buyer_nft_account;
        buyer_ata.owner = ctx.accounts.buyer.key();
        buyer_ata.mint = ctx.accounts.nft_mint.key();

        Ok(())
    }

    pub fn create_fusion(
        ctx: Context<CreateFusion>,
        fusion_name: String,
        fusion_symbol: String,
        fusion_uri: String,
    ) -> Result<()> {
        let fusion_state = &mut ctx.accounts.fusion_state;
        fusion_state.total_fusions += 1;

        // Create fusion NFT mint
        let fusion_mint = &mut ctx.accounts.fusion_mint;
        fusion_mint.mint_authority = Some(ctx.accounts.authority.key());
        fusion_mint.freeze_authority = Some(ctx.accounts.authority.key());

        // Create fusion metadata
        let metadata_accounts = CreateMetadataAccountsV3 {
            metadata: ctx.accounts.fusion_metadata.to_account_info(),
            mint: ctx.accounts.fusion_mint.to_account_info(),
            mint_authority: ctx.accounts.authority.to_account_info(),
            payer: ctx.accounts.creator.to_account_info(),
            update_authority: ctx.accounts.authority.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: Some(ctx.accounts.rent.to_account_info()),
        };

        let creator = vec![mpl_token_metadata::state::Creator {
            address: ctx.accounts.creator.key(),
            verified: true,
            share: 100,
        }];

        let data_v2 = mpl_token_metadata::state::DataV2 {
            name: fusion_name,
            symbol: fusion_symbol,
            uri: fusion_uri,
            seller_fee_basis_points: 500, // 5%
            creators: Some(creator),
            collection: None,
            uses: None,
        };

        create_metadata_accounts_v3(
            CpiContext::new(
                ctx.accounts.metadata_program.to_account_info(),
                metadata_accounts,
            ),
            data_v2,
            true,
            true,
            None,
            None,
            None,
        )?;

        // Mint fusion NFT to creator
        let creator_ata = &mut ctx.accounts.creator_fusion_account;
        creator_ata.owner = ctx.accounts.creator.key();
        creator_ata.mint = ctx.accounts.fusion_mint.key();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + FusionState::INIT_SPACE,
        seeds = [b"fusion_state"],
        bump
    )]
    pub fusion_state: Account<'info, FusionState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyNft<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut)]
    pub seller: AccountInfo<'info>,
    #[account(mut)]
    pub nft_mint: Account<'info, Mint>,
    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub seller_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub buyer_nft_account: Account<'info, TokenAccount>,
    /// CHECK: This is the metadata account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub metadata_program: Program<'info, Metadata>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct CreateFusion<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        mut,
        seeds = [b"fusion_state"],
        bump = fusion_state.bump
    )]
    pub fusion_state: Account<'info, FusionState>,
    #[account(mut)]
    pub fusion_mint: Account<'info, Mint>,
    #[account(mut)]
    pub creator_fusion_account: Account<'info, TokenAccount>,
    /// CHECK: This is the metadata account
    #[account(mut)]
    pub fusion_metadata: UncheckedAccount<'info>,
    pub authority: Signer<'info>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub metadata_program: Program<'info, Metadata>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
#[derive(InitSpace)]
pub struct FusionState {
    pub authority: Pubkey,
    pub bump: u8,
    pub total_fusions: u64,
    pub total_revenue: u64,
} 